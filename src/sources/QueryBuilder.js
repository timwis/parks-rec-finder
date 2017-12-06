import squel from 'squel'
import _ from 'underscore'
import tables from './CartoDBTables'
import {
  stringifyCoordinates
} from '@/utilities/utils'

let postgresSQL = squel.useFlavour('postgres')
const METERS_TO_MILES_RATIO = 0.000621371

export function selectPrograms () {
  let programsQuery = postgresSQL
                        .select()
                        .from(tables.programs)
                        .field(`${tables.programs}.*`)
                        .join(tables.facilities, null, `${tables.facilities}.id = ${tables.programs}.facility->>0`)

  return joinPPRAssetsWith(programsQuery)
}

export function selectFacilities () {
  // get facilites and assets with latitude and longitude values
  let locationsQuery = postgresSQL
                          .select()
                          .from(tables.facilities)
                          .field(`${tables.facilities}.*`)

  return joinPPRAssetsWith(locationsQuery)
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
export function joinPPRAssetsWith (sqlQueryObj) {
  return sqlQueryObj
          .join(tables.assets, null, `${tables.assets}.objectid = ${tables.facilities}.pprassets_object_id`)
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
  * @param {object} sqlQueryObj - passed by reference query object
  *
  * @since 0.0.0
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
  * @param {object} sqlQueryObj - passed by reference query object
  * @param {string} coordinates - comma separated latitude and longitude values
  *
  * @since 0.0.0
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
   * @param {[type]} sqlQueryObj [description]
   * @param {[type]} zipcode     [description]
   *
   * @since 0.0.0
   */
export function addWithinZipCodeField (sqlQueryObj, zipcode) {
  sqlQueryObj
    .field(`ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom) as within_zip_code`)
    .left_join(`${tables.zipcodes}`, null, `${tables.zipcodes}.code = '${zipcode}'`)

  orderByMilesFromZipcode(sqlQueryObj)
}

/**
   * Freetext search implementation using a basic SQL ILIKE
   * @param  {object} sqlQueryObj   [description]
   * @param  {Array}  fields        array of fields to search on
   * @param  {string} searchText user input freetext search value
   * @return {void}
   *
   * @since 0.0.0
   */
  // ILIKE constructor
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

export function addFilters (sqlQueryObj, filters) {
  filters = _.omit(filters, val => _.isNull(val))
  for (let filterKey in filters) {
    if (filterKey === 'fee') {
      let _feeCompartor = filters[filterKey] === 'Free' ? '=' : '!='
      sqlQueryObj.where(`${filterKey} ${_feeCompartor} '0.00'`)
    }
    if (filterKey === 'ageRange' && (filters[filterKey].low > 0 && filters[filterKey].high > 0)) {
      let {high, low} = filters[filterKey]
      sqlQueryObj.where(`age_low >= ${low}`)
      sqlQueryObj.where(`age_high <= ${high}`)
    }
    if (filterKey === 'gender') {
      sqlQueryObj.where(`gender->>0 = '${filters[filterKey]}'`)
    }
  }
}
