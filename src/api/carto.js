import axios from 'axios'
import squel from 'squel'
import camelcaseKeys from 'camelcase-keys'

const METERS_TO_MILES_RATIO = 0.000621371

export default class Carto {
  constructor (baseURL) {
    this.client = axios.create({ baseURL })
  }

  async request (query) {
    const sql = query.toString()
    const params = { q: sql }
    const response = await this.client({ params })
    return response.data.rows.map(camelcaseKeys)
  }

  /**
   * Gets a list of activity categories with a count of activities. Omits
   * activities with no active schedules. Omits categories that aren't
   * published, as well as activities that aren't public/approved/active.
   */
  getActivityCategories () {
    const query = squel.useFlavour('postgres')
      .select()
      .with('program_activity_categories_tmp', squel.useFlavour('postgres')
        .select()
        .field('jsonb_array_elements_text(activity_category) as exploded_activity_category')
        .from('ppr_programs')
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
          'program_schedules',
          'true'
        )
        .where('ppr_programs.program_is_public')
        .where('ppr_programs.program_is_approved')
        .where('ppr_programs.program_is_active')
        .where('jsonb_array_length(program_schedules.schedules) > 0')
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

  /**
   * Gets a list of location categories with a count of locations. Omits
   * categories that aren't published, as well as locations that aren't
   * published.
   */
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

  /**
   * Gets the printable name of a category by its slug
   */
  async getActivityCategoryDetails (categorySlug) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'id': 'id',
        'activity_category_name': 'name'
      })
      .from('ppr_activity_categories')
      .where(`regexp_replace(regexp_replace(lower(trim(ppr_activity_categories.activity_category_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g') = ?`, categorySlug)

    const rows = await this.request(query)
    if (rows.length === 0) throw new Error('Not found')
    return rows[0]
  }

  /**
   * Gets the printable name of a category by its slug
   */
  async getLocationCategoryDetails (categorySlug) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'id': 'id',
        'location_type_name': 'name'
      })
      .from('ppr_location_types')
      .where(`regexp_replace(regexp_replace(lower(trim(ppr_location_types.location_type_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g') = ?`, categorySlug)
      .where('location_type_is_published = true')

    const rows = await this.request(query)
    if (rows.length === 0) throw new Error('Not found')
    return rows[0]
  }

  /**
   * Gets a list of activities by category, location, or search term.
   * Optionally ordered by distance to search location. Includes basic location
   * info, location geometry, and activity schedules. Omits activities with no
   * active schedules. Omits activities that aren't public/approved/active.
   */
  getActivities ({ categoryId, searchTerm, searchLocationGeometry, locationId }) {
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
        'ppr_facilities.id': 'location_id',
        'ppr_facilities.facility_name': 'location_name',
        'ppr_facilities.address': 'location_address',
        'program_schedules.schedules': 'schedules',
        "regexp_replace(regexp_replace(lower(trim(program_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g')": 'slug'
      })
      .field('json_build_array(ST_Y(ppr_website_locatorpoints.the_geom), ST_X(ppr_website_locatorpoints.the_geom))', 'location_geometry')
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
        'program_schedules',
        'true'
      )
      .where('ppr_programs.program_is_public')
      .where('ppr_programs.program_is_approved')
      .where('ppr_programs.program_is_active')
      .where('jsonb_array_length(program_schedules.schedules) > 0')

    if (categoryId) {
      query.where('ppr_programs.activity_category ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
    }
    if (searchTerm) {
      query.where(
        squel.expr()
          .and('ppr_programs.program_name ILIKE ?', `%${searchTerm}%`)
          .or('ppr_programs.programdescriptionshort ILIKE ?', `%${searchTerm}%`)
      )
    }
    if (searchLocationGeometry) {
      const geometryString = `${searchLocationGeometry[1]},${searchLocationGeometry[0]}`
      query.field(`
        ST_Distance(
          ppr_website_locatorpoints.the_geom,
          ST_SetSRID(
            ST_Point(${geometryString}),
            4326
          )::geography
        ) * ${METERS_TO_MILES_RATIO}
      `, 'distance')
      query.order('distance')
    }
    if (locationId) {
      query.where('ppr_programs.facility->>0 = @', locationId)
    }

    return this.request(query)
  }

  /**
   * Gets a list of locations by category or search term. Optionally ordered by
   * distance to search location. Includes geometry.
   */
  getLocations ({ categoryId, searchTerm, searchLocationGeometry }) {
    const query = squel.useFlavour('postgres')
      .select({ parameterCharacter: '@' }) // '?' is used as jsonb operator
      .fields({
        'ppr_facilities.id': 'id',
        'ppr_facilities.facility_name': 'name',
        'ppr_facilities.address': 'address',
        'ppr_facilities.contact_phone': 'phone',
        "regexp_replace(regexp_replace(lower(trim(facility_name)), '[^a-zA-Z0-9]', '-', 'g'), '\\-\\-+', '-', 'g')": 'slug'
      })
      .field('json_build_array(ST_Y(ppr_website_locatorpoints.the_geom), ST_X(ppr_website_locatorpoints.the_geom))', 'geometry')
      .from('ppr_facilities')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .where('facility_is_published = true')

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
          ppr_website_locatorpoints.the_geom,
          ST_SetSRID(
            ST_Point(${geometryString}),
            4326
          )::geography
        ) * ${METERS_TO_MILES_RATIO}
      `, 'distance')
      query.order('distance')
    } else {
      query.order('name')
    }

    return this.request(query)
  }

  /**
   * Gets a single activity by id. Includes basic location info, location
   * geometry, and activity schedules.
   */
  async getActivityDetails (id) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'ppr_programs.id': 'id',
        'ppr_programs.program_name': 'name',
        'ppr_programs.programdescriptionshort': 'description',
        'ppr_programs.age_low': 'age_low',
        'ppr_programs.age_high': 'age_high',
        'ppr_programs.fee': 'fee',
        'ppr_programs.fee_frequency->>0': 'fee_frequency',
        'ppr_programs.gender->>0': 'gender',
        'ppr_programs.registration_status->>0': 'registration_status',
        'ppr_programs.registration_form_link': 'registration_link',
        'ppr_facilities.id': 'location_id',
        'ppr_facilities.facility_name': 'location_name',
        'ppr_facilities.address': 'location_address',
        'ppr_facilities.contact_phone': 'location_phone',
        'program_schedules.schedules': 'schedules'
      })
      .field('json_build_array(ST_Y(ppr_website_locatorpoints.the_geom), ST_X(ppr_website_locatorpoints.the_geom))', 'location_geometry')
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
        'program_schedules',
        'true'
      )
      .where('ppr_programs.id = ?', id)

    const rows = await this.request(query)
    if (rows.length === 0) throw new Error('Not found')
    return rows[0]
  }

  /**
   * Gets a single location by id. Includes location geometry and location
   * schedules.
   */
  async getLocationDetails (id) {
    const query = squel.useFlavour('postgres')
      .select()
      .fields({
        'ppr_facilities.facility_name': 'name',
        'ppr_facilities.facility_description': 'description',
        'ppr_facilities.address': 'address',
        'ppr_facilities.contact_phone': 'phone',
        'ppr_facilities.location_contact_name': 'site_contact',
        'program_schedules.schedules': 'schedules'
      })
      .field('json_build_array(ST_Y(ppr_website_locatorpoints.the_geom), ST_X(ppr_website_locatorpoints.the_geom))', 'geometry')
      .from('ppr_facilities')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .left_join(
        squel.str('LATERAL (?)', squel.useFlavour('postgres')
          .select()
          .field('jsonb_agg(ppr_facility_schedules)', 'schedules')
          .from(
            squel.useFlavour('postgres')
              .select()
              .fields([
                'ppr_facility_schedules.id',
                'date_from::date',
                'date_to::date',
                'time_from::time',
                'time_to::time',
                'days'
              ])
              .field('jsonb_agg(ppr_days.days_name)', 'days')
              .from('ppr_facility_schedules')
              .from('jsonb_array_elements_text(days)', 'expanded_days')
              .left_join('ppr_days', null, 'ppr_days.id = expanded_days')
              .where('facility->>0 = ppr_facilities.id')
              // .where('date_to >= current_timestamp') // ppr_facility_schedules appears to always have this null
              .group('ppr_facility_schedules.id')
              .group('ppr_facility_schedules.date_from') // TODO: Any way to improve this group by?
              .group('ppr_facility_schedules.date_to')
              .group('ppr_facility_schedules.time_from')
              .group('ppr_facility_schedules.time_to')
              .group('ppr_facility_schedules.days'),
            'ppr_facility_schedules'
          )
        ).toString(),
        'program_schedules',
        'true'
      )
      .where('ppr_facilities.id = ?', id)

    const rows = await this.request(query)
    if (rows.length === 0) throw new Error('Not found')
    return rows[0]
  }

  /**
   * Gets a zipcode polygon centroid by the zipcode string.
   */
  async getZipcodeGeometry (zipcode) {
    const query = squel.useFlavour('postgres')
      .select()
      .field('json_build_array(ST_Y(ST_Centroid(the_geom)), ST_X(ST_Centroid(the_geom)))', 'centroid')
      .from('zip_codes')
      .where('code = ?', zipcode)

    const rows = await this.request(query)
    if (rows.length === 0) throw new Error('Zipcode not found')
    return rows[0].centroid
  }
}
