import axios from 'axios'
import squel from 'squel'
import camelcaseKeys from 'camelcase-keys'

const METERS_TO_MILES_RATIO = 0.000621371

export default class Carto {
  constructor (baseURL) {
    this.client = axios.create({ baseURL })
  }

  request (query) {
    const sql = query.toString()
    const params = { q: sql }
    return this.client({ params })
      .then((res) => res.data.rows)
      .then(camelcaseKeys)
  }

  getActivityCategories () {
    const query = squel.useFlavour('postgres')
      .select()
      .with('program_activity_categories_tmp', squel
        .select()
        .field('jsonb_array_elements_text(activity_category) as exploded_activity_category')
        .from('ppr_programs')
        .where('ppr_programs.program_is_public')
        .where('ppr_programs.program_is_approved')
        .where('ppr_programs.program_is_active')
      )
      .fields({
        'count(*)': 'count',
        'activity_category_id': 'id',
        'activity_category_name': 'name',
        'activity_category_description': 'description',
        'activity_category_photo': 'photo_id',
        "regexp_replace(regexp_replace(lower(trim(activity_category_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g')": 'slug'
      })
      .from('program_activity_categories_tmp')
      .left_join('ppr_activity_categories', null, 'program_activity_categories_tmp.exploded_activity_category = ppr_activity_categories.id')
      .where('activity_category_is_published = true')
      .group('activity_category_id')
      .group('activity_category_name')
      .group('activity_category_description')
      .group('activity_category_photo')
      .order('count', false)

    return this.request(query)
  }

  getLocationCategories () {
    const query = squel.useFlavour('postgres')
      .select()
      .with('facility_location_types_tmp', squel
        .select()
        .field('jsonb_array_elements_text(location_type) as exploded_location_type')
        .from('ppr_facilities')
        .where('facility_is_published = true')
      )
      .fields({
        'count(*)': 'count',
        'location_type_id': 'id',
        'location_type_name': 'name',
        'location_type_description': 'description',
        'location_type_photo': 'photo_id',
        "regexp_replace(regexp_replace(lower(trim(location_type_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g')": 'slug'
      })
      .from('facility_location_types_tmp')
      .left_join('ppr_location_types', null, 'facility_location_types_tmp.exploded_location_type = ppr_location_types.id')
      .where('location_type_is_published = true')
      .group('location_type_id')
      .group('location_type_name')
      .group('location_type_description')
      .group('location_type_photo')
      .order('count', false)

    return this.request(query)
  }

  getActivityCategoryDetails (category) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'id': 'id',
        'activity_category_name': 'name'
      })
      .from('ppr_activity_categories')
      .where(`regexp_replace(regexp_replace(lower(trim(ppr_activity_categories.activity_category_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g') = ?`, category)

    return this.request(query)
      .then((rows) => rows[0])
  }

  getLocationCategoryDetails (category) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'id': 'id',
        'location_type_name': 'name'
      })
      .from('ppr_location_types')
      .where(`regexp_replace(regexp_replace(lower(trim(ppr_location_types.location_type_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g') = ?`, category)
      .where('location_type_is_published = true')

    return this.request(query)
      .then((rows) => rows[0])
  }

  getActivities ({ categoryId, searchTerm, searchLocationGeometry }) {
    const query = squel.useFlavour('postgres')
      .select({ parameterCharacter: '@' }) // '?' is used as jsonb operator
      .fields({
        'ppr_programs.id': 'id',
        'ppr_programs.program_name': 'name',
        'ppr_programs.age_low': 'age_low',
        'ppr_programs.age_high': 'age_high',
        'ppr_programs.fee': 'fee',
        'ppr_programs.fee_frequency->>0': 'fee_frequency',
        'ppr_programs.gender->>0': 'gender',
        'ppr_facilities.facility_name': 'facility_name',
        'ppr_facilities.address': 'facility_address',
        'schedules.*': 'schedules'
      })
      .field('json_build_array(ST_Y(ST_Centroid(ppr_website_locatorpoints.the_geom)), ST_X(ST_Centroid(ppr_website_locatorpoints.the_geom)))', 'facility_geometry')
      .from('ppr_programs')
      .join('ppr_facilities', null, 'ppr_facilities.id = ppr_programs.facility->>0')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .left_join(
        squel.str('LATERAL (?)', squel.useFlavour('postgres')
          .select()
          .field('jsonb_agg(ppr_program_schedules)', 'schedules')
          .from(
            squel.useFlavour('postgres')
              .select()
              .fields([
                'ppr_program_schedules.id',
                'date_from::date',
                'date_to::date',
                'time_from::time',
                'time_to::time',
                'days'
              ])
              .field('jsonb_agg(ppr_days.days_name)', 'days')
              .from('ppr_program_schedules')
              .from('jsonb_array_elements_text(days)', 'expanded_days')
              .left_join('ppr_days', null, 'ppr_days.id = expanded_days')
              .where('program->>0 = ppr_programs.id')
              .where('date_to >= current_timestamp')
              .group('ppr_program_schedules.id')
              .group('ppr_program_schedules.date_from') // TODO: Any way to improve this group by?
              .group('ppr_program_schedules.date_to')
              .group('ppr_program_schedules.time_from')
              .group('ppr_program_schedules.time_to')
              .group('ppr_program_schedules.days'),
            'ppr_program_schedules'
          )
        ).toString(),
        'schedules',
        'true'
      )
      .where('ppr_programs.program_is_public')
      .where('ppr_programs.program_is_approved')
      .where('ppr_programs.program_is_active')

    if (categoryId) {
      query.where('ppr_programs.activity_category ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
    }
    if (searchTerm) {
      query.where(
        squel.expr()
          .and('ppr_programs.program_name ILIKE ?', `%${searchTerm}%`)
          .or('ppr_programs.program_description ILIKE ?', `%${searchTerm}%`)
      )
    }
    if (searchLocationGeometry) {
      const geometryString = `${searchLocationGeometry[1]},${searchLocationGeometry[0]}`
      query.field(`
        ST_Distance(
          ST_Centroid(ppr_website_locatorpoints.the_geom),
          ST_SetSRID(
            ST_Point(${geometryString}),
            4326
          )::geography
        ) * ${METERS_TO_MILES_RATIO}
      `, 'distance')
      query.order('distance')
    }

    return this.request(query)
  }

  getLocations ({ categoryId, searchTerm, searchLocationGeometry }) {
    const query = squel.useFlavour('postgres')
      .select({ parameterCharacter: '@' }) // '?' is used as jsonb operator
      .fields({
        'ppr_facilities.id': 'id',
        'ppr_facilities.facility_name': 'name',
        'ppr_facilities.address': 'address'
      })
      .field('json_build_array(ST_Y(ST_Centroid(ppr_website_locatorpoints.the_geom)), ST_X(ST_Centroid(ppr_website_locatorpoints.the_geom)))', 'geometry')
      .from('ppr_facilities')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')

    if (categoryId) {
      query.where('ppr_facilities.location_type ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
    }
    if (searchTerm) {
      query.where(
        squel.expr()
          .and('ppr_facilities.facility_name ILIKE ?', `%${searchTerm}%`)
          .or('ppr_facilities.long_name ILIKE ?', `%${searchTerm}%`)
          .or('ppr_facilities.facility_description ILIKE ?', `%${searchTerm}%`)
      )
    }
    if (searchLocationGeometry) {
      const geometryString = `${searchLocationGeometry[1]},${searchLocationGeometry[0]}`
      query.field(`
        ST_Distance(
          ST_Centroid(ppr_website_locatorpoints.the_geom),
          ST_SetSRID(
            ST_Point(${geometryString}),
            4326
          )::geography
        ) * ${METERS_TO_MILES_RATIO}
      `, 'distance')
      query.order('distance')
    }

    return this.request(query)
  }

  getActivityDetails (id) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'ppr_programs.id': 'id',
        'ppr_programs.program_name': 'name',
        'ppr_programs.age_low': 'age_low',
        'ppr_programs.age_high': 'age_high',
        'ppr_programs.fee': 'fee',
        'ppr_programs.fee_frequency->>0': 'fee_frequency',
        'ppr_programs.gender->>0': 'gender',
        'ppr_facilities.facility_name': 'facility_name',
        'ppr_facilities.address': 'facility_address',
        'schedules.*': 'schedules'
      })
      .field('json_build_array(ST_Y(ST_Centroid(ppr_website_locatorpoints.the_geom)), ST_X(ST_Centroid(ppr_website_locatorpoints.the_geom)))', 'facility_geometry')
      .from('ppr_programs')
      .join('ppr_facilities', null, 'ppr_facilities.id = ppr_programs.facility->>0')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .left_join(
        squel.str('LATERAL (?)', squel.useFlavour('postgres')
          .select()
          .field('jsonb_agg(ppr_program_schedules)', 'schedules')
          .from(
            squel.useFlavour('postgres')
              .select()
              .fields([
                'ppr_program_schedules.id',
                'date_from::date',
                'date_to::date',
                'time_from::time',
                'time_to::time',
                'days'
              ])
              .field('jsonb_agg(ppr_days.days_name)', 'days')
              .from('ppr_program_schedules')
              .from('jsonb_array_elements_text(days)', 'expanded_days')
              .left_join('ppr_days', null, 'ppr_days.id = expanded_days')
              .where('program->>0 = ppr_programs.id')
              .where('date_to >= current_timestamp')
              .group('ppr_program_schedules.id')
              .group('ppr_program_schedules.date_from') // TODO: Any way to improve this group by?
              .group('ppr_program_schedules.date_to')
              .group('ppr_program_schedules.time_from')
              .group('ppr_program_schedules.time_to')
              .group('ppr_program_schedules.days'),
            'ppr_program_schedules'
          )
        ).toString(),
        'schedules',
        'true'
      )
      .where('ppr_programs.id = ?', id)

    return this.request(query)
      .then((rows) => rows[0])
  }

  getLocationDetails (id) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'ppr_facilities.facility_name': 'name',
        'ppr_facilities.facility_description': 'description',
        'ppr_facilities.address': 'address',
        'ppr_facilities.contact_phone': 'phone',
        'ppr_facilities.location_contact_name': 'site_contact'
      })
      .field('json_build_array(ST_Y(ST_Centroid(ppr_website_locatorpoints.the_geom)), ST_X(ST_Centroid(ppr_website_locatorpoints.the_geom)))', 'geometry')
      .from('ppr_facilities')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .where('ppr_facilities.id = ?', id)

    return this.request(query)
      .then((rows) => rows[0])
  }

  getZipcodeGeometry (zipcode) {
    const query = squel.useFlavour('postgres')
      .select()
      .field('json_build_array(ST_Y(ST_Centroid(the_geom)), ST_X(ST_Centroid(the_geom)))', 'centroid')
      .from('zip_codes')
      .where('code = ?', zipcode)

    return this.request(query)
      .then((rows) => rows[0].centroid)
  }
}
