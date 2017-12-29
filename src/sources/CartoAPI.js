import axios from 'axios'
import {
  isValidZipcode,
  deSlugify
} from '@/utilities/utils'
import PPRFQuery from './PPRFQueryBuilder'

const LOG_QUERIES = process.env.NODE_ENV === 'development'

/**
 * API abstracton layer for querying the City of Philadelphia's CARTO ( Location Intelligence Software) Database
 * @docs https://cityofphiladelphia.github.io/carto-api-explorer/#<table-name>
 *
 * @since 0.1.0
 */
class CartoAPI {
  constructor (httpClient) {
    this.LOG_QUERIES = LOG_QUERIES
    // set our api base url for all requests
    this.http = httpClient.create({baseURL: process.env.CARTO_API.BASE})
    // this._facilities = selectFacilities()
    this.programFields = ['id', 'program_name', 'program_description', 'age_low', 'age_high', 'fee']
  }

  /**
   * GET SQL query results from the Cart API
   * @param  {string} sqlString - SQL Query
   * @return {object}           Prmoise Object with raw results
   *
   * @since 0.1.0
   */
  runQuery (sqlQuery) {
    let sqlString = sqlQuery.build().query

    if (window.localStorage.getItem(sqlString)) {
      if (this.LOG_QUERIES) {
        console.log(`Carto API:fromLocalStorageCache \n ${sqlString}`)
      }
      return new Promise((resolve) => {
        resolve(JSON.parse(window.localStorage.getItem(sqlString)))
      })
    }

    if (this.LOG_QUERIES) {
      console.log(`Carto API:runQuery \n ${sqlString}`)
    }

    return this.http.get(`sql?q=${encodeURIComponent(sqlString)}`)
                    .then(results => {
                      this.cacheQuery(sqlString, results)
                      return results
                    })
  }

  cacheQuery (sqlQueryString, data) {
    let store = window.localStorage
    if (store.getItem(sqlQueryString)) {
      alert(sqlQueryString)
    } else {
      store.setItem(sqlQueryString, JSON.stringify(data))
    }
  }

  search (searchParams, coords) {
    let facilitiesSearchQuery = this.getFacilities(searchParams.fields.freetext, coords, searchParams.fields.zip)
    let programsSearchQuery = this.getPrograms(searchParams.fields.freetext, coords, searchParams.fields.zip, searchParams.filters)
    return Promise.all([facilitiesSearchQuery, programsSearchQuery])
  }

  /**
   * get all results from the ppr_days table
   * @return {object} Promise
   *
   * @since 0.1.0
   */
  getDays () {
    return this.runQuery(new PPRFQuery.Builder('days'))
  }

  /**
   * Given freetext and coordniates values
   * return a SQL query string to search the PPR_Programs tables
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {string}              SQL query
   *
   * @since 0.1.0
   */
  getPrograms (freetextValue, coords = null, zipcode = null, filters = null) {
    this.programs = new PPRFQuery.Builder('programs')
                                   .fields(this.programFields)
                                   .joinPPRAssets()
    // get facilites and assets with latitude and longitude values
    if (coords && !zipcode) {
      this.programs
          .addDistanceFieldFromCoordinates(coords)
    }

    if ((zipcode && isValidZipcode(zipcode)) && !coords) {
      this.programs
            .addWithinZipCodeField(zipcode)
            .orderByMilesFromZipcode()
    }

    if (freetextValue !== null && freetextValue !== '') {
      // search via user input text value
      this.programs
          .searchFieldsFor(['program_name', 'program_description'], freetextValue)
    }

    if (filters) {
      this.programs
          .addFilters(filters)
    }

    return this.runQuery(this.programs)
  }

  /**
   * get a program entity by id
   * @param  {string} programID program.program_id
   *
   * @return {object}           Promise
   *
   * @since 0.1.0
   */
  getProgramByID (programID) {
    return this.runQuery(
      new PPRFQuery.Builder('program', {id: programID})
                   .fields(this.programFields)
                   .joinPPRAssets()
    )
  }

  /**
   * given a program_id get all associated
   * schedule days for that program
   * @param  {string} programID program.program_id
   * @return {object}           Promise
   */
  getProgramDays (programID) {
    return this.runQuery(new PPRFQuery.Builder('programScheduleDays', {id: programID}))
  }
  /**
   * Given a `facility_id` get all programs associated
   * with that faciity
   * @param  {string} facilityID facility.facility_id
   * @return {object}            Promise
   *
   * @since 0.1.0
   */
  getProgramsByFacilityID (facilityID) {
    return this.runQuery(
       new PPRFQuery.Builder('programs')
                     .fields(['id', 'program_name'])
                     .where(`ppr_programs.facility->>0 = '${facilityID}'`)
    )
  }

  /**
   * Given freetext and coordniates values
   * return a SQL query string to serach the PPR_Facilites and PPR_Assets tables
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {object}              Promise
   *
   * @since 0.1.0
   */
  getFacilities (freetextValue, coords = null, zipcode = null) {
    this.facilities = new PPRFQuery.Builder('facilities').joinPPRAssets()

    if (coords && !zipcode) {
      this.facilities
          .addDistanceFieldFromCoordinates(coords)
    }

    if ((zipcode && isValidZipcode(zipcode)) && !coords) {
      this.facilities
            .addWithinZipCodeField(zipcode)
            .orderByMilesFromZipcode()
    }

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      this.facilities
          .searchFieldsFor(['facility_description', 'facility_name', 'long_name'], freetextValue)
    }

    return this.runQuery(this.facilities)
  }

  /**
   * Get facility by facility_id
   * @param  {string} facilityID facility_id, not the id column
   * @return {object}            Promise
   *
   * @since 0.1.0
   */
  getFacilityByID (facilityID) {
    return this.runQuery(
      new PPRFQuery.Builder('facility', {id: facilityID})
                   .joinPPRAssets()
    )
  }

  /**
   * given an entity type get a list of entity categories
   * @param  {string} entityType name of entity
   * @return {void}
   *
   * @since 0.1.0
   */
  getEntityTaxonomy ({entityType, taxonomy}) {
    if (taxonomy === 'category') { taxonomy = 'Categories' }
    let taxonomyQuery = new PPRFQuery.Builder(`${entityType}${taxonomy}`)
    return this.runQuery(taxonomyQuery)
  }

  /**
   * given an entity object retrieve all entites with given taxonomyTerm
   * @param  {object} entity {entityType: String, taxonomyTerm: String}
   * @return {void}
   *
   * @since 0.1.0
   */
  getTaxonomyTermEntities (entity, filters) {
    let taxonomyTerm = deSlugify(entity.entityTerm)
    let categoryEntityQuery = new PPRFQuery.Builder(`${entity.entityType}Category`, {term: taxonomyTerm})
                                           .joinPPRAssets()
    if (filters && entity.entityType === 'programs') {
      categoryEntityQuery
        .addFilters(filters)
    }

    return this.runQuery(categoryEntityQuery)
  }
}

export let cartoAPI = new CartoAPI(axios)
