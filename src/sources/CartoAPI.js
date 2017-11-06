import axios from 'axios'
import squel from 'squel'

/**
 * API abstracton layer for querying the City of Philadelphia's CARTO ( Location Intelligence Software) Database
 * @docs https://cityofphiladelphia.github.io/carto-api-explorer/#<table-name>
 */
class CartoAPI {
  constructor (httpClient, sqlQueryBuilder) {
    this.LOG_QUERIES = true
    // set our api base url for all requests
    this.http = httpClient.create({baseURL: process.env.CARTO_API.BASE})
    this.sqlQueryBuilder = sqlQueryBuilder
    this.tables = {
      facilities: 'ppr_facilities',
      assets: 'ppr_assets',
      programs: 'ppr_programs'
    }
  }

  /**
   * GET SQL query results from the Cart API
   * @param  {string} sqlString - SQL Query
   * @return {object}           Prmoise Object with raw results
   *
   * @since 0.0.0
   */
  runQuery (sqlString) {
    // log queries
    this.http.interceptors.request.use((config) => {
      if (this.LOG_QUERIES) { console.log(`Carto: ${config.baseURL}${config.url}`) }
      return config
    })
    return this.http.get(`sql?q=${sqlString}`)
  }

  /**
   * Makes sure that coordinates passed to SQL queries are strings
   * @param  {any} coordinates - any coordinates input value
   * @return {string}             comma separated latitiude and longitude values
   */
  _stringifyCoordinates (coordinates = null) {
    if (coordinates === null || (typeof coordinates === 'string' && coordinates.includes(','))) {
      return coordinates
    } else if (Array.isArray(coordinates) && (coordinates.length === 2)) {
      return coordinates.join(',')
    } else if (typeof coordinates === 'object' && (coordinates.hasOwnProperty('latitude') && coordinates.hasOwnProperty('longitude'))) {
      return `${coordinates.latitude},${coordinates.longitude}`
    }
  }

  /**
   * Given freetext and coordniates values
   * return a SQL query string to serach the PPR_Facilites and PPR_Assets tables
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {string}              SQL query
   *
   * @since 0.0.0
   */
  queryAddressBy (freetextValue, coords = null) {
    let coordinates = this._stringifyCoordinates(coords)
    // get facilites and assets with latitude and longitude values
    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from(this.tables.facilities)
                          .field('ppr_facilities.*')
                          .join(this.tables.assets, null, `${this.tables.assets}.objectid = pprassets_object_id`)
                          .field(`ST_Y(
                                    ST_Centroid(${this.tables.assets}.the_geom)
                                  ) as latitude`)
                          .field(`ST_X(
                                    ST_Centroid(${this.tables.assets}.the_geom)
                                  ) as longitude`)
    if (coordinates) {
      // get facilities within relative distance to given coordinates
      sqlQuery
        .field(`ST_Distance(
                  ST_Centroid(${this.tables.assets}.the_geom),
                  ST_SetSRID(
                    ST_Point(${coordinates}),
                    4326
                  )
                ) as distance`)
        .order('distance')
    }

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      sqlQuery
        .where(
          squel.expr()
                  .and(`facility_description ILIKE '%${freetextValue}%'`)
                  .or(`facility_name ILIKE '%${freetextValue}%'`)
                  .or(`long_name ILIKE '%${freetextValue}%'`)
        )
    }

    return encodeURIComponent(sqlQuery.toString())
  }

  getAll (contentType = null) {
    if (contentType === null) { return }
    let _query = this.sqlQueryBuilder.select().from(`ppr_${contentType}`).limit(100)
    return this.runQuery(_query.toString())
  }
}

export let cartoAPI = new CartoAPI(axios, squel)
