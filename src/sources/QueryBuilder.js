import squel from 'squel'
import _ from 'underscore'
import tables from './CartoDBTables'
import {
  stringifyCoordinates
} from '@/utilities/utils'

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
  let programsQuery = postgresSQL
                        .select()
                        .from(tables.programs)
                        .field(`${tables.programs}.*`)
                        .field(`${tables.programs}.gender->>0`, 'gender')
                        // .join(tables.facilities, null, `${tables.facilities}.id = ${tables.programs}.facility->>0`)
                        .join(tables.facilities, null, `${tables.programs}.facility->>0 = ${tables.facilities}.id`)
                        .join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
                        .field('days')
                        .field('address', 'facility_address')
                        .field('facility_name')
                        .field(`facility->>0`, 'facility_id')
                        .where(`publish = 'true'`)

  return joinPPRAssetsWith(programsQuery)
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
export function joinProgramsOnCategories (programsQueryObj) {
  programsQueryObj
    // .join(tables.facilities, null, `${tables.facilities}.id = ${tables.programs}.facility->>0`)
    // .join(`${tables.programCategoryTerms}`, 'activityType', `${tables.programs}.activity_type->>0 = activityType.id`)
    // .join(tables.programCategories, 'category', `activityType.actvity_type_category = category.activity_category_name::text`)
    .join(tables.programCategories, 'category', `activityType.actvity_category->>0 = category.id`)

    // @TODO: replace JOINs with below two lines when "category" column is added to ppr_programs table
    // and update all function calls
    // .field(`category`)
    // .where(`category = '${taxonomyTerm}'`)

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
                        .where(`${tables.programs}.program_id = ${programID}::text`)

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
 * given a program_id get all schedule days for that program
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
    .from(`(SELECT program_id, jsonb_array_elements_text(${tables.programSchedules}.days) _daysID FROM ${tables.programSchedules})`, 'a')
    .join(tables.days, 'b', 'b.id = a._daysID')
    .where(`program_id = ${programID}`)
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
 * Get a count of all programs in a category
 * that are associated with a facility
 * associated facility must have a `website_locator_points_link_id`
 *
 * @param  {string} catTerm category term to fetch programs for
 * @return {object} squel.js query builder object
 *
 * @since 0.1.0
 */
export function selectProgramsCountPerCategoryTerm (catTerm) {
  // get programs per category
  let subSelectProgramsQuery = postgresSQL
                                .select()
                                .field(`count(*)`)
                                .from(tables.programs)
                                .join(tables.programCategories, 'category', `${tables.programs}.activity_category->>0 = category.id`)
                                // @TODO replace joinProgramsOnCategories with "WHERE program.category = ppr_activity_categories.activity_category_name" once the schmea is in place
                                // .where(`${tables.programs}.category = ${tables.programCategories}.activity_category_name`)

  // joinProgramsOnCategories(subSelectProgramsQuery)

  subSelectProgramsQuery
    // .join(tables.assets, null, `${tables.facilities}.website_locator_points_link_id = ${tables.assets}.linkid`)
    .where(`category::text = ${catTerm}.activity_category_name`)
  return subSelectProgramsQuery
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

      taxonomyQuery
        .from(taxonomyTable, entityName)
        .field(`${entityName}.activity_category_name`)
        .field(`${entityName}.activity_category_description`)
        .field(`${entityName}.activity_category_photo`)
        .field('count(*)', 'count')
        .join(tables.programs, null, `${tables.programs}.activity_category->>0 = ${entityName}.id`)
        .group(`${entityName}.activity_category_name, ${entityName}.activity_category_description, ${entityName}.activity_category_photo`)
        .order('activity_category_name')
      break

    case 'locations':
      entityName = 'location' + taxonomy
      taxonomyTable = tables[`${entityName}`]

      taxonomyQuery
        .from(taxonomyTable, entityName)
        .field(`${entityName}.location_type_name`)
        .field(`${entityName}.location_type_description`)
        .field(`${entityName}.location_type_photo`)
        .field(`${entityName}.id`)
        .field(
          postgresSQL
            .select()
            .field('count(id)')
            .from(tables.facilities)
            .where(`${tables.facilities}.location_type->>0 = ${entityName}.id`)
          , 'count')
        .order('location_type_name')
        .where(`${entityName}.location_type_is_published = true`)
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
    categoryEntitiesQuery = postgresSQL
                              .select()
                              .from(tables.programs)
                              // .field(`${tables.programs}.*`)
                              .field(`${tables.programs}.id`)
                              .field(`${tables.programs}.facility`)
                              .field(`${tables.programs}.program_id`)
                              .field(`${tables.programs}.program_name_full`)
                              .field(`${tables.programs}.activity_type`)
                              .field(`${tables.programs}.program_name`)
                              .field(`${tables.programs}.program_description`)
                              .field(`${tables.programs}.age_low`)
                              .field(`${tables.programs}.age_high`)
                              .field(`${tables.programs}.fee`)
                              .field(`${tables.programs}.publish`)
                              .field(`${tables.programs}.is_active`)
                              .field(`${tables.programs}.gender->>0`, 'gender')
                              .field(`category`)

    joinProgramsOnCategories(categoryEntitiesQuery)
    if (taxonomyTerm) {
      categoryEntitiesQuery.where(`category = '${taxonomyTerm}'`)
    }
  } else if (entityType === 'locations') {
    categoryEntitiesQuery = postgresSQL
                              .select()
                              .from(tables.facilities)
                              .field(`${tables.facilities}.*`)
                              .join(`${tables.locationCategories}`, 'type', `type.location_type_name = ${tables.facilities}.facility_type`)
    if (taxonomyTerm) {
      categoryEntitiesQuery.where(`${tables.facilities}.facility_type = '${taxonomyTerm}'`)
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
      sqlQueryObj.where(`ARRAY[${filters.days.map(dayID => `'${dayID}'`)}] = ARRAY(SELECT jsonb_array_elements_text(days))`)
    }
  }
}
