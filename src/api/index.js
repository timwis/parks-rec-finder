import axios from 'axios'
import squel from 'squel'
import camelcaseKeys from 'camelcase-keys'

export default class Api {
  constructor (baseURL) {
    this.client = axios.create({ baseURL })
  }

  getActivityCategories () {
    const query = squel
      .select()
      .field('actvity_type_category', 'activity_type_category') // misspelled in table
      .from('ppr_activity_types')
      .group('activity_type_category')
      .toString()
    const params = { q: query }
    return this.client({ params })
      .then((res) => res.data)
      .then((data) => data.rows.map(camelcaseKeys))
  }
}
