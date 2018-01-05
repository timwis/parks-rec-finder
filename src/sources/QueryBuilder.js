/* eslint-disable no-unused-vars */
import PPRFQuery from './PPRFQueryBuilder'
import squel from 'squel'
import _ from 'underscore'
import tables from './CartoDBTables'
import { stringifyCoordinates } from '@/utilities/utils'

let postgresSQL = squel.useFlavour('postgres')
const METERS_TO_MILES_RATIO = 0.000621371

/**
 * get all ppr_programs records from DB
 * joined on ppr_facilities and ppr_assets tables
 * to include the facility and lat, lng info
 *
 * @return {object} programs query populated with facility, schedule, and assets data
 *
 * @since 0.1.0
 */
export function selectPrograms () {
  return new PPRFQuery.Builder('programs')
              .fields(['*'])
              .joinPPRAssets()
              .build()
              .query
}

/**
 * Add the program category to the results set by
 * joining facility, activity type, and activity categories columns to the given query
 * @param  {object} programsQueryObj squel.js query builder object
 *
 * @return {object}                  query builder object with joined tables
 *
 * @since 0.1.0
 */
export function joinProgramsOnCategories (programsQueryObj, taxonomyTerm) {
  programsQueryObj
    .join(tables.facilities, null, `${tables.facilities}.id = ${tables.programs}.facility->>0`)
    .join(tables.programCategories, 'category', `category.id = ${tables.programs}.activity_category->>0`)
    .field(`category`)
  if (taxonomyTerm) {
    programsQueryObj.where(`category.activity_category_name = '${taxonomyTerm}'`)
  }

  return programsQueryObj
}
/**
 * get a single program by program_id
 * @param  {string} programID program_id
 *
 * @return {object}           program query builder object
 *
 * @since 0.1.0
 */
export function selectProgram (programID) {
  let programQuery = selectPrograms()
                        .field('address')
                        .field('facility_name')
                        // .field('time_from', 'state_time')
                        // .field('time_to', 'end_time')
                        // .field('frequency')
                        .field(`to_char(date_from, 'Month DD, YYYY')`, 'start_date')
                        .field(`to_char(date_to, 'Month DD, YYYY')`, 'end_date')
                        .field(`${tables.facilities}.id`, 'location_id')
                        .where(`${tables.programs}.id = '${programID}'`)
  return programQuery
}

/**
 * get all results from the ppr_days table
 * @return {object} query builder object
 *
 * @since 0.1.0
 */
export function selectDays () {
  return postgresSQL
          .select()
          .from(tables.days)
}
/**
 * given a program.id get all schedule days for that program
 * from the ppr_days table
 * @param  {string} programID ppr_programs.program_id
 *
 * @return {object}           query builder object
 *
 * @since 0.1.0
 */
export function selectDaysByProgram (programID) {
  return postgresSQL
    .select()
    .from(`(SELECT program, jsonb_array_elements_text(${tables.programSchedules}.days) _daysID FROM ${tables.programSchedules})`, 'a')
    .join(tables.days, 'b', 'b.id = a._daysID')
    .where(`program->>0 = '${programID}'`)
}

/**
 * given a facility_id select all programs associated with that
 * facility
 * @param  {string} facilityID facility_id property
 *
 * @return {object}            query builder object
 *
 * @since 0.1.0
 */
export function selectProgramsByFacilityID (facilityID) {
  return selectPrograms().where(`ppr_programs.facility->>0 = '${facilityID}'`)
}

/**
 * get all ppr_facilites records from DB
 * joined on ppr_assets to include lat, lng info
 *
 * @return {object} squel.js query builder object
 *
 * @since 0.1.0
 */
export function selectFacilities () {
  // get facilites and assets with latitude and longitude values
  let locationsQuery = postgresSQL
                          .select()
                          .from(tables.facilities)
                          .field(`${tables.facilities}.*`)

  return joinPPRAssetsWith(locationsQuery)
}

/**
 * given a facility id get a facility
 * @param  {string} facilityID facility.id
 * @return {object}            query builder object
 *
 * @since 0.1.0
 */
export function selectFacility (facilityID) {
  let facilityQuery = selectFacilities()
                          .field('address')
                          .field(`ARRAY(SELECT ${tables.programs}.program_name FROM ${tables.programs} WHERE ${tables.programs}.facility->>0 = ${tables.facilities}.id)`,
                            'programs')
                          .where(`${tables.facilities}.id = '${facilityID}'`)

  return facilityQuery
}

/**
 * given an entityType that maps to a table table
 * get a distinct list of categories from the associated taxonomy terms table
 *
 * @param  {string} entityType name of entity from url
 * @return {object} squel.js query builder object
 *
 * @since 0.1.0
 *
 */
export function selectTaxonomy ({entityType, taxonomy}) {
  if (taxonomy === 'category') { taxonomy = 'Categories' }

  let taxonomyTable
  let entityName
  let taxonomyQuery = postgresSQL.select()

  switch (entityType) {
    case 'programs':
      entityName = 'program' + taxonomy
      taxonomyTable = tables[`${entityName}`]

      taxonomyQuery = new PPRFQuery.Builder('programsCategories').build().query
      break

    case 'locations':
      entityName = 'location' + taxonomy
      taxonomyTable = tables[`${entityName}`]

      taxonomyQuery = new PPRFQuery.Builder('locationsCategories').build().query
      break
  }

  return taxonomyQuery
}

/**
 * given an entity type get a list of entities
 * that contain the given category term
 * restults set joined on ppr_assets to include lat, lng info
 *
 * @param  {string} entityType   name of entity
 * @param  {string} taxonomyTerm term to search against
 * @return {object} squel.js query builder object
 *
 * @since 0.1.0
 */
export function selectCategoryEntitiesFor (entityType, taxonomyTerm) {
  let categoryEntitiesQuery = postgresSQL
  if (entityType === 'programs') {
    return new PPRFQuery.Builder(`${entityType}Category`, {term: taxonomyTerm}).joinPPRAssets().build().query
  } else if (entityType === 'locations') {
    categoryEntitiesQuery = postgresSQL
                              .select()
                              .from(tables.facilities)
                              .field(`${tables.facilities}.*`)
                              .join(`${tables.locationCategories}`, 'type', `type.id = ${tables.facilities}.location_type->>0`)
    if (taxonomyTerm) {
      categoryEntitiesQuery.where(`location_type_name = '${taxonomyTerm}'`)
    }
  }
  return joinPPRAssetsWith(categoryEntitiesQuery)
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
  * @since 0.1.0
  */
export function joinPPRAssetsWith (sqlQueryObj) {
  return sqlQueryObj
          .join(tables.assets, null, `${tables.facilities}.website_locator_points_link_id = ${tables.assets}.linkid`)
          .field(`ST_Y(
            ST_Centroid(${tables.assets}.the_geom)
            ) as latitude`)
          .field(`ST_X(
            ST_Centroid(${tables.assets}.the_geom)
            ) as longitude`)
}

/**
  * get entities within relative distance to given coordinates
  * returned in ascending order of miles
  *
  * @param {object} sqlQueryObj - squel.js query builder object
  *
  * @since 0.1.0
  */
export function orderByMilesFromZipcode (sqlQueryObj) {
  sqlQueryObj
    .field(`ST_Distance(
      ST_Centroid(${tables.assets}.the_geom)::geography,
      ST_Centroid(${tables.zipcodes}.the_geom)::geography
      ) * ${METERS_TO_MILES_RATIO} as distance`)
    .order('distance')
}

/**
  * Given a set of coordinates get entites in ascening order of distance in miles
  *
  * @param {object} sqlQueryObj - squel.js query builder object
  * @param {string} coordinates - comma separated latitude and longitude values
  *
  * @since 0.1.0
  */
export function addDistanceFieldFromCoordinates (sqlQueryObj, coordinates) {
  sqlQueryObj
    .field(`ST_Distance(
      ST_Centroid(${tables.assets}.the_geom)::geography,
      ST_SetSRID(
      ST_Point(${stringifyCoordinates(coordinates)}),
      4326
      )::geography
      )  * ${METERS_TO_MILES_RATIO} as distance`)
    .order('distance')
}

 /**
   * Given a zipcode get entities in ascending order of
   * distance from centroid of zipcode polygon in units of miles
   *
   * @param {object} sqlQueryObj squel.js query builder object
   * @param {number} zipcode     pre-validated zipcode
   *
   * @since 0.1.0
   */
export function addWithinZipCodeField (sqlQueryObj, zipcode) {
  sqlQueryObj
    .field(`ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom) as within_zip_code`)
    .left_join(`${tables.zipcodes}`, null, `${tables.zipcodes}.code = '${zipcode}'`)

  orderByMilesFromZipcode(sqlQueryObj)
}

/**
   * Freetext search implementation using a basic SQL ILIKE
   * @param  {object} sqlQueryObj   squel.js query builder object
   * @param  {array}  fields        array of field names (strings) to search on
   * @param  {string} searchText user input freetext search value
   * @return {void}
   *
   * @since 0.1.0
   */

  // EXAMPLE:
  // sqlQuery
  //  .where(
  //    squel.expr()
  //            .and(`program_name ILIKE '%${searchText}%'`)
  //            .or(`program_description ILIKE '%${searchText}%'`)
  //  )
export function searchFieldsFor (sqlQueryObj, fields = [], searchText) {
  let sqlExpr = null
  for (let i in fields) {
    let ilikeStatement = `${fields[i]} ILIKE '%${searchText}%'`
    if (i === '0') {
      sqlExpr = squel.expr().and(ilikeStatement)
    } else {
      sqlExpr.or(ilikeStatement)
    }
  }
  sqlQueryObj.where(sqlExpr)
}

/**
 * given an array of filter objects
 * add each valid filter to the query as a WHERE clause
 *
 * @param {oject} sqlQueryObj squel.js query builder object
 * @param {array} filters     array of filter object {filterName: String, filterValue: any}
 *
 * @since 0.1.0
 */
export function addFilters (sqlQueryObj, filters) {
  filters = _.omit(filters, val => _.isNull(val))
  let filterQuery = sqlQueryObj.query
  for (let filterKey in filters) {
    if (filterKey === 'fee') {
      let _feeCompartor = filters[filterKey] === 'Free' ? '=' : '!='
      sqlQueryObj.where(`${filterKey} ${_feeCompartor} '0.00'`)
    }
    if (filterKey === 'ages' && typeof filters[filterKey] === 'string') {
      let ages = filters[filterKey].split('-')
      sqlQueryObj.where(`age_low >= ${ages[0]}`)
      sqlQueryObj.where(`age_high <= ${ages[1]}`)
    }
    if (filterKey === 'gender') {
      sqlQueryObj.where(`gender->>0 = '${filters[filterKey]}'`)
    }
    if (filterKey === 'days' && filters[filterKey].length) {
      let days = _.isArray(filters[filterKey]) ? filters[filterKey] : [filters[filterKey]]
      sqlQueryObj
        .field('days')
        .join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
        .where(`ARRAY[${days.map(dayID => `'${dayID}'`)}] = ARRAY(SELECT jsonb_array_elements_text(days))`)
    }
  }
}
