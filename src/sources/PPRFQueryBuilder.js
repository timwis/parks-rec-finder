import _ from 'underscore'
import { stringifyCoordinates } from '@/utilities/utils'
import resolveEntityType from '@/utilities/entity-type-resolver'

import squel from 'squel'
import tables from './CartoDBTables'

import ProgramsQuery from './ProgramQueries'
import FacilitiesQuery from './FacilitiesQuery'
import TaxonomyQuery from './TaxonomyQuery'

const METERS_TO_MILES_RATIO = 0.000621371
const TIME_FORMAT = 'HH:MI am'
const DATE_FORMAT = 'Month DD, YYYY'

/**
 * Builder object for PPRF CartoDB specific SQL statement strings.
 * This class allows you to easily construct SQL strings by chaining
 * together methods to add parts to your SQL statement.
 * It uses [squel.js]( https://hiddentao.com/squel/) as it's engine and
 * provides central control over meta queries for entities such as Programs and Facilites.
 *
 * @example: https://medium.com/@axelhadfeg/builder-pattern-using-javascript-and-es6-ec1539182e24
 * USEAGE:
 * ```js
 *  new PPRFQuery.Builder('program', {id: programID})
 *                 .fields(['id', 'program_name', 'program_description', 'age_low', 'age_high', 'fee'])
 *                 .joinPPRAssets()
 *                 .build()
 * ```
 *
 * @since 0.2.5
 *
 */
export default class PPRFQuery {
  constructor (build) {
    this.queryString = build.query.toString()
  }

  /**
   * internal builder that holds our chainable builder methods
   */
  static get Builder () {
    class Builder {
      constructor (entityType, entityOptions) {
        this.postgreSQL = squel.useFlavour('postgres')
        this.options = entityOptions

        // resolve our passed in entity
        this.entity = resolveEntityType(entityType)

        // map to the Query to be built
        switch (this.entity.name) {
          case 'program':
          case 'programCategory':
            this.query = new ProgramsQuery(this)
            break
          case 'facilityCategories':
          case 'programCategories':
            this.query = new TaxonomyQuery(this)
            break
          case 'programSchedules':
            // get current program schedules
            this.query = this.postgreSQL
                             .select()
                             .field('days')
                             .field(`to_char(time_from, '${TIME_FORMAT}')`, 'time_from')
                             .field(`to_char(time_to, '${TIME_FORMAT}')`, 'time_to')
                             .field(`to_char(date_from, '${DATE_FORMAT}')`, 'start_date')
                             .field(`to_char(date_to, '${DATE_FORMAT}')`, 'end_date')
                             .from(this.entity.DBTable)
                             .where(`program->>0 = '${this.options.id}'`)
                             .where('date_to >= now()')
            break
          case 'facility':
          case 'facilityCategory':
            this.query = new FacilitiesQuery(this)
            break
          case 'days':
            // this is also cached in localStorage on app load
            this.query = this.postgreSQL.select().from(this.entity.DBTable)
            break
        }

        return this
      }

      /**
       * monkey patch to expose squel.js 'where' method
       * @param  {string} whereClause
       * @return {Builder Object}             PPRFQuery.Builder Object
       *
       * @since 0.2.5
       */
      where (whereClause) {
        this.query.where(whereClause)
        return this
      }

      /**
       * given an array of field name add each to the query.
       * if array value is an object map it as a field alias
       * @param  {array} fieldDefs   array of field names, either a string or object of schema {field-name String: field-alias String}
       * @param  {string} tablePrefix table name to prefix to field
       * @return {Builder Object}             PPRFQuery.Builder Object
       *
       * @since 0.2.5
       */
      fields (fieldDefs, tablePrefix = this.entity.DBTable) {
        if (_.isArray(fieldDefs)) {
          fieldDefs.forEach(field => {
            if (_.isObject(field)) {
              this.query.field(`${tablePrefix}.${Object.keys(field)[0]}`, Object.values(field)[0])
            } else {
              this.query.field(`${tablePrefix}.${field}`)
            }
          })
        }

        return this
      }

      /**
       * * monkey patch to expose squel.js 'field' method
       * @param  {string} fieldName name of field
       * @return {Builder Object}           PPRFQuery.Builder method
       *
       * @since 0.2.5
       */
      field (fieldName) {
        this.query.field(fieldName)
        return this
      }

      /**
       * monkey patch to expose squel.js `join` method
       * @return {Builder Object}           PPRFQuery.Builder method
       *
       * @since 0.2.5
       */
      join (joinTable, alias = null, joinClause) {
        this.query.join(joinTable, alias, joinClause)
        return this
      }

      order (orderClause, dsc = true) {
        this.query.order(orderClause, dsc)
        return this
      }

      /**
       * INNER JOIN ppr_assets with ppr_facilites
       * This allows gives us our geospatial fields for latitude and longitiude
       * This is needed to map both Locations and Programs (each program is related to a Location allowing it to be mapped)
       * @return {Builder Object}           PPRFQuery.Builder method
       *
       * @since 0.2.5
       */
      joinPPRAssets () {
        this.query
             .join(tables.assets, null, `${tables.facilities}.website_locator_points_link_id = ${tables.assets}.linkid`)
             .field(`ST_Y(ST_Centroid(${tables.assets}.the_geom)) as latitude`)
            .field(`ST_X(ST_Centroid(${tables.assets}.the_geom)) as longitude`)
        return this
      }

      /**
      * Given an array of fields and a text value to search
      * constructs and ILIKE comparison for each field.
      * reetext search implementation using a basic SQL ILIKE
      *
      * @param  {object} sqlQueryObj   squel.js query builder object
      * @param  {array}  fields        array of field names (strings) to search on
      * @param  {string} searchText user input freetext search value
      * @return {Builder Object}           PPRFQuery.Builder method
      *
      * @since 0.2.5
      */

      // EXAMPLE:
      // sqlQuery
      //  .where(
      //    squel.expr()
      //            .and(`program_name ILIKE '%${searchText}%'`)
      //            .or(`program_description ILIKE '%${searchText}%'`)
      //  )
      searchFieldsFor (fields = [], searchText) {
        let sqlExpr = null
        for (let i in fields) {
          let ilikeStatement = `${fields[i]} ILIKE '%${searchText}%'`
          if (i === '0') {
            sqlExpr = squel.expr().and(ilikeStatement)
          } else {
            sqlExpr.or(ilikeStatement)
          }
        }
        this.query.where(sqlExpr)
        return this
      }

      /**
      * Given a zipcode get entities in ascending order of
      * distance from centroid of zipcode polygon in units of miles
      *
      * @param {number} zipcode     pre-validated zipcode
      * @return {Builder Object}           PPRFQuery.Builder method
      *
      * @since 0.2.5
      */
      addWithinZipCodeField (zipcode) {
        this.query
            .field(`ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom)`, 'within_zip_code')
            .left_join(`${tables.zipcodes}`, null, `${tables.zipcodes}.code = '${zipcode}'`)
            .order(`(case when ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom) then 1 when ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom) is null then 2 else 3 end)`)

        return this
      }

      /**
      * get entities within relative distance to given coordinates
      * returned in ascending order of miles
      *
      * @return {Builder Object}           PPRFQuery.Builder method
      *
      * @since 0.2.5
      */
      orderByMilesFromZipcode () {
        this.query
          .field(`ST_Distance(
            ST_Centroid(${tables.assets}.the_geom)::geography,
            ST_Centroid(${tables.zipcodes}.the_geom)::geography
            ) * ${METERS_TO_MILES_RATIO} as distance`)
          .order('distance')
        return this
      }

    /**
      * Given a set of coordinates get entites in ascening order of distance in miles
      *
      * @param {string|array} coordinates - comma separated latitude and longitude values
      * @return {Builder Object}           PPRFQuery.Builder method
      *
      * @since 0.2.5
      */
      addDistanceFieldFromCoordinates (coordinates) {
        this.query
          .field(`ST_Distance(
            ST_Centroid(${tables.assets}.the_geom)::geography,
            ST_SetSRID(
            ST_Point(${stringifyCoordinates(coordinates)}),
            4326
            )::geography
            )  * ${METERS_TO_MILES_RATIO} as distance`)
          .order('distance')

        return this
      }

      /**
      * given an array of filter objects
      * add each valid filter to the query as a WHERE clause
      * with appropriate comparison
      *
      * @param {array} filters     array of filter object {filterName: String, filterValue: any}
      *
      * @since 0.2.5
      */
      addFilters (filters) {
        filters = _.omit(filters, val => _.isNull(val))
        let filterQuery = this.query

        for (let filterKey in filters) {
          // FILTER: COST <string>
          if (filterKey === 'fee') {
            let _feeCompartor = filters[filterKey] === 'Free' ? '=' : '!='
            if (filters[filterKey] === 'Free') {
              filterQuery.where(`${filterKey} ${_feeCompartor} '0.00' OR ${filterKey} ${_feeCompartor} ''`)
            } else {
              filterQuery.where(`${filterKey} ${_feeCompartor} '0.00' AND ${filterKey} ${_feeCompartor} ''`)
            }
          }

          // FILTER: AGE RANGE <string>
          if (filterKey === 'ages' && typeof filters[filterKey] === 'string') {
            let ages = filters[filterKey].split('-')
            let filterAgeLow = ages[0]
            let filterAgeHigh = ages[1]
            filterQuery.where(`(age_low >= ${filterAgeLow} AND age_low <= ${filterAgeHigh})`).order('age_low')
            // filterQuery.where(`(age_high <= ${filterAgeHigh} AND age_high >= ${filterAgeLow}) OR (age_low >= ${filterAgeLow} AND age_low < ${filterAgeHigh})`)
          }

          // FILTER: GENDER <string>
          if (filterKey === 'gender') {
            filterQuery.where(`gender->>0 = '${filters[filterKey]}' OR gender->>0 = 'M/F'`)
          }

          // FILTER: DATE RANGE <iso-date-string>
          if (filters['startDate'] || filters['endDate']) {
            const startDate = filters['startDate']
            const endDate = filters['endDate']
            // just start date given
            let dateClamp = null
            if (startDate && !endDate) {
              dateClamp = `date_from >= '${startDate}' `
            } else if (endDate && !startDate) {
              dateClamp = `date_from > '${endDate}'`
            } else if (startDate && endDate) {
              dateClamp = `( date_from >= '${startDate}' AND date_to < '${startDate}' ) OR ( date_from > '${endDate}' AND date_to <= '${endDate}' )`
            } else {
              throw new TypeError(`PPRFQuery::addFilters DATE RANGE 'startDate' or 'endDate' parameters not found`)
            }

            let subQuery = this.postgreSQL
                .select()
                .field('program->>0', 'program')
                .from(tables.programSchedules)
                .where(dateClamp)
                .group('program')

            filterQuery
              .field('matched_programs.program')
              .with('matched_programs', subQuery)
              .join('matched_programs', null, `matched_programs.program = ${tables.programs}.id`)
          }

          // FILTER: DAY OF WEEK <string[]>
          // group by program schedule days (gives nested jsonb array [['<day-id>'],['<day-id>','<day-id>','<day-id>'], ... ])
          // cast to string and remove brackets to get a space separated string of day ids
          // to check the values against those passed in
          if (filterKey === 'days' && filters[filterKey].length) {
            let days = _.isArray(filters[filterKey]) ? filters[filterKey] : [filters[filterKey]]

            // get current programs grouped on schedules
            filterQuery
              .join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
              .where('date_to >= now()')
              .group(`${tables.programs}.id,
                      program_name,
                      program_name_full,
                      program_id,
                      program_description,
                      facility_is_published,
                      age_low,
                      age_high,
                      fee,
                      ppr_facilities.facility_name,
                      gender,
                      address,
                      facility,
                      ${tables.assets}.the_geom,
                      fee_frequency`)
              // .having('count(days) > ?', 1)
            if (this.entity.DBTable === tables.programCategoryTerms) {
              filterQuery.group('activity_type, activity_category_name')
            }
            // if filters for both Date Range and Day of Week are selected
            // we need to include our new column into the group by
            if (filters['startDate'] || filters['endDate']) {
              filterQuery.group('matched_programs.program')
            }

            // check all current program schedule days for passed in days filter
            for (var i = 0; i < days.length; i++) {
              // note: 'jsonb_agg(days)' creates the nested jsonb_agg array mentioned above
              /* eslint-disable no-useless-escape */
              filterQuery.having(`regexp_replace(jsonb_agg(days)::text,'\[|\]|"|,', '', 'g') iLIKE '%${days[i]}%'`)
            }
          }
        }

        return this
      }

      /**
       * Construct our full query object and
       * return the query string
       * @return {String} postgreSQL statement
       *
       * @since 0.2.5
       */
      build () {
        return new PPRFQuery(this).queryString
      }
    }

    return Builder
  }
}
