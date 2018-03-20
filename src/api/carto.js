import axios from 'axios'
import squel from 'squel'

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
      .field('ST_AsGeoJSON(ST_Centroid(ppr_website_locatorpoints.the_geom))::json', 'geometry')
      .from('ppr_facilities')
      .join('ppr_website_locatorpoints', null, 'ppr_website_locatorpoints.linkid = ppr_facilities.website_locator_points_link_id')
      .where('ppr_facilities.location_type ? @', categoryId) // '?' is jsonb operator; '@' is substitution param
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data.rows)
  }
}
