import axios from 'axios'
import squel from 'squel'

/**
 * API abstracton layer for querying the City of Philadelphia's CARTO ( Location Intelligence Software) Database
 * @docs https://cityofphiladelphia.github.io/carto-api-explorer/#<table-name>
 *
 * @since 0.0.0
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
      programs: 'ppr_programs',
      zipcodes: 'zip_codes'
    }
    this.METERS_TO_MILES_RATIO = 0.000621371
  }

  /**
   * GET SQL query results from the Cart API
   * @param  {string} sqlString - SQL Query
   * @return {object}           Prmoise Object with raw results
   *
   * @since 0.0.0
   */
  runQuery (sqlString) {
    return this.http.get(`sql?q=${sqlString}`)
  }

  /**
   * Makes sure that coordinates passed to SQL queries are strings
   * @param  {any} coordinates - any coordinates input value
   * @return {string}             comma separated latitiude and longitude values
   *
   * @since 0.0.0
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
   * Add in assets from the PPR Assets table
   * in order to get the latitiude and longitude of the entity
   * Will return assets based on given coordinates or zipcode
   *
   * @param {object} sqlQueryObj - passed by reference query object
   * @param {string} coordinates - comma separated latitude and longitude values
   * @param {number} zipcode
   * @return void
   *
   * @since 0.0.0
   */
  _addPPRAssetsToQuery (sqlQueryObj, coordinates, zipcode) {
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

  /**
   * get entities within relative distance to given coordinates
   * returned in ascending order of miles
   *
   * @param {object} sqlQueryObj - passed by reference query object
   *
   * @since 0.0.0
   */
  _addDistanceAsMiles (sqlQueryObj) {
    sqlQueryObj
      .field(`ST_Distance(
                    ST_Centroid(${this.tables.assets}.the_geom)::geography,
                    ST_Centroid(${this.tables.zipcodes}.the_geom)::geography
                  ) * ${this.METERS_TO_MILES_RATIO} as distance`)
      .order('distance')
  }

  /**
   * Given a set of coordinates get entites in ascening order of distance in miles
   *
   * @param {object} sqlQueryObj - passed by reference query object
   * @param {string} coordinates - comma separated latitude and longitude values
   *
   * @since 0.0.0
   */
  _addCoordinatesToQuery (sqlQueryObj, coordinates) {
    sqlQueryObj
      .field(`ST_Distance(
                ST_Centroid(${this.tables.assets}.the_geom)::geography,
                ST_SetSRID(
                  ST_Point(${coordinates}),
                  4326
                )::geography
              )  * ${this.METERS_TO_MILES_RATIO} as distance`)
      .order('distance')
  }

  /**
   * Given a zipcode get entities in ascending order of
   * distance from centroid of zipcode polygon in units of miles
   *
   * @param {[type]} sqlQueryObj [description]
   * @param {[type]} zipcode     [description]
   *
   * @since 0.0.0
   */
  _addZipcodeToQuery (sqlQueryObj, zipcode) {
    this._addDistanceAsMiles(sqlQueryObj)
    sqlQueryObj
        .field(`ST_Intersects(${this.tables.zipcodes}.the_geom, ${this.tables.assets}.the_geom) as within_zip_code`)
        .left_join(`${this.tables.zipcodes}`, null, `${this.tables.zipcodes}.code = '${zipcode}'`)
  }

  /**
   * Freetext search implementation using a basic SQL ILIKE
   * @param  {object} sqlQueryObj   [description]
   * @param  {Array}  fields        array of fields to search on
   * @param  {string} freetextValue user input freetext search value
   * @return {void}
   *
   * @since 0.0.0
   */
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
  queryProgramsBy (freetextValue, coords = null, zipcode = null, filters) {
    // get facilites and assets with latitude and longitude values
    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from(this.tables.programs)
                          .field(`${this.tables.programs}.*`)
                          .join(this.tables.facilities, null, `${this.tables.facilities}.id = ${this.tables.programs}.facility->>0`)

    this._addPPRAssetsToQuery(sqlQuery, this._stringifyCoordinates(coords), zipcode)

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      this._buildFreetextWHERE(sqlQuery, ['program_name', 'program_description'], freetextValue)
    }

    if (filters) {
      this._addFilters(sqlQuery, filters)
    }

    if (this.LOG_QUERIES) { console.log(`CartoAPI:queryProgramsBy::${sqlQuery.toString()}`) }
    return encodeURIComponent(sqlQuery.toString())
  }

  _addFilters (sqlQueryObj, filters) {
    for (let filterKey in filters) {
      if (filterKey === 'fee' && filters[filterKey] != null) {
        let _feeCompartor = filters[filterKey] ? '!=' : '='
        sqlQueryObj.where(`${filterKey} ${_feeCompartor} '0.00'`)
      }

      if (filterKey === 'ageRange' && (filters[filterKey].low > 0 && filters[filterKey].high > 0)) {
        let {high, low} = filters[filterKey]
        sqlQueryObj.where(`age_low >= ${low}`)
        sqlQueryObj.where(`age_high <= ${high}`)
      }

      if (filterKey === 'gender' && filters[filterKey] != null) {
        sqlQueryObj.where(`gender->>0 = '${filters[filterKey]}'`)
      }
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
  queryFacilitiesBy (freetextValue, coords = null, zipcode = null) {
    // get facilites and assets with latitude and longitude values
    let sqlQuery = this.sqlQueryBuilder
                          .select()
                          .from(this.tables.facilities)
                          .field(`${this.tables.facilities}.*`)

    this._addPPRAssetsToQuery(sqlQuery, this._stringifyCoordinates(coords), zipcode)

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      this._buildFreetextWHERE(sqlQuery, ['facility_description', 'facility_name', 'long_name'], freetextValue)
    }
    // if (this.LOG_QUERIES) { console.log(`CartoAPI:queryFacilitiesBy::${sqlQuery.toString()}`) }
    return encodeURIComponent(sqlQuery.toString())
  }
}

export let cartoAPI = new CartoAPI(axios, squel)
