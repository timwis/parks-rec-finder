import axios from 'axios'
import squel from 'squel'
import camelcaseKeys from 'camelcase-keys'

export default class Carto {
  constructor (baseURL) {
    this.client = axios.create({ baseURL })
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
        'activity_category_photo': 'photo'
      })
      .from('program_activity_categories_tmp')
      .left_join('ppr_activity_categories', null, 'program_activity_categories_tmp.exploded_activity_category = ppr_activity_categories.id')
      .where('activity_category_is_published = true')
      .group('activity_category_id')
      .group('activity_category_name')
      .group('activity_category_description')
      .group('activity_category_photo')
      .order('count', false)
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows)
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
        'location_type_photo': 'photo'
      })
      .from('facility_location_types_tmp')
      .left_join('ppr_location_types', null, 'facility_location_types_tmp.exploded_location_type = ppr_location_types.id')
      .where('location_type_is_published = true')
      .group('location_type_id')
      .group('location_type_name')
      .group('location_type_description')
      .group('location_type_photo')
      .order('count', false)
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows)
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
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows[0])
  }

  getLocations ({ categoryId }) {
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
      .where('ppr_facilities.location_type ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows)
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
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows[0])
  }

  getActivities ({ categoryId }) {
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
        'ppr_facilities.address': 'facility_address'
      })
      .field('json_build_array(ST_Y(ST_Centroid(ppr_website_locatorpoints.the_geom)), ST_X(ST_Centroid(ppr_website_locatorpoints.the_geom)))', 'facility_geometry')
      .from('ppr_programs')
      .join('ppr_facilities', null, 'ppr_facilities.id = ppr_programs.facility->>0')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .where('ppr_programs.activity_category ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
      .where('ppr_programs.program_is_public')
      .where('ppr_programs.program_is_approved')
      .where('ppr_programs.program_is_active')
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows)
      .then(camelcaseKeys)
  }

  getLocation (id) {
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
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows[0])
      .then(camelcaseKeys)
  }
}
