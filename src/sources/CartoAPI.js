import axios from 'axios'
import {
  isValidZipcode,
  deSlugify
} from '@/utilities/utils'
import {
  selectPrograms,
  selectProgram,
  selectProgramsByFacilityID,
  selectDaysByProgram,
  selectFacilities,
  selectFacility,
  selectTaxonomy,
  selectCategoryEntitiesFor,
  orderByMilesFromZipcode,
  addDistanceFieldFromCoordinates,
  addWithinZipCodeField,
  searchFieldsFor,
  addFilters,
  selectDays
} from './QueryBuilder'

const LOG_QUERIES = process.env.NODE_ENV === 'development'

/**
 * API abstracton layer for querying the City of Philadelphia's CARTO ( Location Intelligence Software) Database
 * @docs https://cityofphiladelphia.github.io/carto-api-explorer/#<table-name>
 *
 * @since 0.0.0
 */
class CartoAPI {
  constructor (httpClient) {
    this.LOG_QUERIES = LOG_QUERIES
    // set our api base url for all requests
    this.http = httpClient.create({baseURL: process.env.CARTO_API.BASE})
    this._programs = selectPrograms()
    this._facilities = selectFacilities()
  }

  set programs (programs) {
    this._programs = programs
  }
  // stringify sql query
  get programs () {
    return this._programs.toString()
  }

  set facilities (programs) {
    this._facilities = programs
  }
  // stringify sql query
  get facilities () {
    return this._facilities.toString()
  }

  /**
   * GET SQL query results from the Cart API
   * @param  {string} sqlString - SQL Query
   * @return {object}           Prmoise Object with raw results
   *
   * @since 0.0.0
   */
  runQuery (sqlString) {
    if (this.LOG_QUERIES) {
      console.log(`Carto API:runQuery \n ${sqlString}`)
    }
    return this.http.get(`sql?q=${encodeURIComponent(sqlString)}`)
  }

  /**
   * get all results from the ppr_days table
   * @return {object} Promise
   *
   * @since 0.0.0
   */
  getDays () {
    return this.runQuery(selectDays())
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
  getPrograms (freetextValue, coords = null, zipcode = null, filters = null) {
    this._programs = selectPrograms()
    // get facilites and assets with latitude and longitude values
    if (coords && !zipcode) {
      addDistanceFieldFromCoordinates(this._programs, coords)
      orderByMilesFromZipcode(this._facilities)
    }

    if ((zipcode && isValidZipcode(zipcode)) && !coords) {
      addWithinZipCodeField(this._programs, zipcode)
    }

    if (freetextValue !== null && freetextValue !== '') {
      // search via user input text value
      searchFieldsFor(this._programs, ['program_name', 'program_description'], freetextValue)
    }

    if (filters) {
      addFilters(this._programs, filters)
    }

    return this.runQuery(this.programs)
  }

  /**
   * get a program entity by id
   * @param  {string} programID program.program_id
   *
   * @return {object}           Promise
   *
   * @since 0.0.0
   */
  getProgramByID (programID) {
    return this.runQuery(
      selectProgram(programID)
    )
  }

  /**
   * given a program_id get all associated
   * schedule days for that program
   * @param  {string} programID program.program_id
   * @return {object}           Promise
   */
  getProgramDays (programID) {
    return this.runQuery(
      selectDaysByProgram(programID)
    )
  }
  /**
   * Given a `facility_id` get all programs associated
   * with that faciity
   * @param  {string} facilityID facility.facility_id
   * @return {object}            Promise
   *
   * @since 0.0.0
   */
  getProgramsByFacilityID (facilityID) {
    return this.runQuery(selectProgramsByFacilityID(facilityID))
  }

  /**
   * Given freetext and coordniates values
   * return a SQL query string to serach the PPR_Facilites and PPR_Assets tables
   * @param  {object} serachParams - UI serach field key values paris
   * @param  {string} coords - comma separated latitude and longitude  of address search field value
   * @return {object}              Promise
   *
   * @since 0.0.0
   */
  getFacilities (freetextValue, coords = null, zipcode = null) {
    this._facilities = selectFacilities()
    if (coords && !zipcode) {
      addDistanceFieldFromCoordinates(this._facilities, coords)
    }

    if ((zipcode && isValidZipcode(zipcode)) && !coords) {
      addWithinZipCodeField(this._facilities)
      orderByMilesFromZipcode(this._facilities)
    }

    if (freetextValue !== null && freetextValue !== '') {
      // search facilites via user input text value
      searchFieldsFor(this._facilities, ['facility_description', 'facility_name', 'long_name'], freetextValue)
    }

    return this.runQuery(this.facilities)
  }

  /**
   * Get facility by facility_id
   * @param  {string} facilityID facility_id, not the id column
   * @return {object}            Promise
   *
   * @since 0.0.0
   */
  getFacilityByID (facilityID) {
    return this.runQuery(
      selectFacility(facilityID)
    )
  }

  /**
   * given an entity type get a list of entity categories
   * @param  {string} entityType name of entity
   * @return {void}
   *
   * @since 0.0.0
   */
  getEntityTaxonomy (taxonomyParams) {
    return this.runQuery(selectTaxonomy(taxonomyParams).toString())
  }

  /**
   * given an entity object retrieve all entites with given taxonomyTerm
   * @param  {object} entity {entityType: String, taxonomyTerm: String}
   * @return {void}
   *
   * @since 0.0.0
   */
  getTaxonomyTermEntities (entity, filters) {
    let taxonomyTerm = deSlugify(entity.entityTerm)
    let categoryEntityQuery = selectCategoryEntitiesFor(entity.entityType, taxonomyTerm)

    if (filters) {
      addFilters(categoryEntityQuery, filters)
      return this.runQuery(categoryEntityQuery)
    }

    return this.runQuery(selectCategoryEntitiesFor(entity.entityType, taxonomyTerm))
  }
}

export let cartoAPI = new CartoAPI(axios)
