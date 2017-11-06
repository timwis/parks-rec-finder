import axios from 'axios'
import squel from 'squel'

class CartoAPI {
  constructor (httpClient, sqlQueryBuilder) {
    // set our api base
    this.http = httpClient.create({baseURL: process.env.CARTO_API.BASE})
    this.sqlQueryBuilder = sqlQueryBuilder
  }

  /**
   * GET SQL query results from the Cart API
   * @param  {string} sqlString - SQL Query
   * @return {object}           Prmoise Object with raw results
   */
  runQuery (sqlString) {
    return this.http.get(`sql?q=${sqlString}`)
  }

  _stringifyCoordinates (coordinates = null) {
    if (typeof coordinates === 'string' && coordinates.includes(',')) {
      return coordinates
    } else if (Array.isArray(coordinates) && (coordinates.length === 2)) {
      return coordinates.join(',')
    } else if (typeof coordinates === 'object' && (coordinates.hasOwnProperty('latitude') && coordinates.hasOwnProperty('longitude'))) {
      return `${coordinates.latitude},${coordinates.longitude}`
    }
  }

  /**
   * Given freetext and address values
   * return a list of PPR Facilites sorted by relative distance
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {[type]}              [description]
   */
  queryAddressBy (freetextValue, coords = null) {
    let coordinates = this._stringifyCoordinates(coords)

    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from('ppr_facilities')
                          .field('ppr_facilities.*')

    if (coordinates) {
      sqlQuery
        .field(`ST_Distance(
                  ST_Centroid(ppr_assets.the_geom),
                  ST_SetSRID(
                    ST_Point(${coordinates}),
                    4326
                  )
                ) as distance`)
        .join('ppr_assets', null, 'ppr_assets.objectid = ppr_assets_objectid')
        .order('distance')
    }

    if (freetextValue !== null && freetextValue !== '') {
      sqlQuery.where(`ILIKE = '%${freetextValue}%'`)
    }
    return sqlQuery.toString()
  }
}

export let cartoAPI = new CartoAPI(axios, squel)
