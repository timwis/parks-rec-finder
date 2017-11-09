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

  _addAssetsToQuery (sqlQueryObj, coordinates, zipcode) {
    debugger
    sqlQueryObj
      .join(this.tables.assets, null, `${this.tables.assets}.objectid = ${this.tables.facilities}.pprassets_object_id`)
      .field(`ST_Y(
                ST_Centroid(${this.tables.assets}.the_geom)
              ) as latitude`)
      .field(`ST_X(
                ST_Centroid(${this.tables.assets}.the_geom)
              ) as longitude`)

    if (coordinates) {
      this._addCoordinatesToQuery(sqlQueryObj, coordinates)
    }

    if (zipcode) {
      this._addZipcodeToQuery(sqlQueryObj, zipcode)
    }
  }

  _addDistanceAsMiles (sqlQueryObj) {
    // get entities within relative distance to given coordinates
    // returned in order of closest by miles
    sqlQueryObj
      .field(`ST_Distance(
                    ST_Centroid(ppr_assets.the_geom)::geography,
                    ST_Centroid(zip_codes.the_geom)::geography
                  ) * 0.000621371 as distance`)
      .order('distance')
  }

  _addCoordinatesToQuery (sqlQueryObj, coordinates) {
    sqlQueryObj
      .field(`ST_Distance(
                ST_Centroid(${this.tables.assets}.the_geom)::geography,
                ST_SetSRID(
                  ST_Point(${coordinates}),
                  4326
                )::geography
              )  * 0.000621371 as distance`)
      .order('distance')
  }

  _addZipcodeToQuery (sqlQueryObj, zipcode) {
    this._addDistanceAsMiles(sqlQueryObj)
    sqlQueryObj
        .field(`ST_Intersects(zip_codes.the_geom, ppr_assets.the_geom) as within_zip_code`)
        .left_join('zip_codes', null, `zip_codes.code = '${zipcode}'`)
  }

  // ILIKE constructor
  // sqlQuery
  //  .where(
  //    squel.expr()
  //            .and(`program_name ILIKE '%${freetextValue}%'`)
  //            .or(`program_description ILIKE '%${freetextValue}%'`)
  //  )
  _buildFreetextWHERE (sqlQueryObj, fields = [], freetextValue) {
    let sqlExpr = null
    for (let i in fields) {
      let ilikeStatement = `${fields[i]} ILIKE '%${freetextValue}%'`
      if (i === '0') {
        sqlExpr = squel.expr().and(ilikeStatement)
      } else {
        sqlExpr.or(ilikeStatement)
      }
    }
    sqlQueryObj.where(sqlExpr)
  }

  /**
   * Given freetext and coordniates values
   * return a SQL query string to search the PPR_Programs tables
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {string}              SQL query
   *
   * @since 0.0.0
   */
  queryProgramsBy (freetextValue, coords = null, zipcode = null) {
    // get facilites and assets with latitude and longitude values
    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from(this.tables.programs)
                          .field(`${this.tables.programs}.*`)
                          .join(this.tables.facilities, null, `${this.tables.facilities}.id = ${this.tables.programs}.facility->>0`)

    this._addAssetsToQuery(sqlQuery, this._stringifyCoordinates(coords), zipcode)

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      this._buildFreetextWHERE(sqlQuery, ['program_name', 'program_description'], freetextValue)
    }
    console.log(sqlQuery.toString())
    return encodeURIComponent(sqlQuery.toString())
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
  queryFacilitiesBy (freetextValue, coords = null, zipcode = null) {
    debugger
    // get facilites and assets with latitude and longitude values
    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from(this.tables.facilities)
                          .field(`${this.tables.facilities}.*`)

    this._addAssetsToQuery(sqlQuery, this._stringifyCoordinates(coords), zipcode)

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      this._buildFreetextWHERE(sqlQuery, ['facility_description', 'facility_name', 'long_name'], freetextValue)
    }

    return encodeURIComponent(sqlQuery.toString())
  }
}

export let cartoAPI = new CartoAPI(axios, squel)
