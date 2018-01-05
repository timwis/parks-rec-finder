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
 * Builder object for PPRF CartoDB specific sql query strings.
 * This class allows you to easily construct SQL strings
 * using [squel.js]( https://hiddentao.com/squel/) as it's engine.
 *
 * @since 0.2.5
 *
 *
 * USEAGE:
 * ```js
 *  new PPRFQuery.Builder('program', {id: programID})
 *                 .fields(['id', 'program_name', 'program_description', 'age_low', 'age_high', 'fee'])
 *                 .joinPPRAssets()
 *                 .build()
 * ```
 */
export default class PPRFQuery {
  constructor (build) {
    this.entityType = build.entityType
    this.queryString = build.query.toString()
    this.queryObject = build.query
  }

  // get query () {
  //   return this.queryString
  // }

  static get Builder () {
    class Builder {
      constructor (entityType, entityOptions) {
        this.entityType = entityType
        this.postgreSQL = squel.useFlavour('postgres')
        this.options = entityOptions
        this.entity = resolveEntityType(entityType)

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
            this.query = this.postgreSQL
                             .select()
                             .field('*')
                             .field(`to_char(time_from, '${TIME_FORMAT}')`, 'time_from')
                             .field(`to_char(time_to, '${TIME_FORMAT}')`, 'time_to')
                             .field(`to_char(date_from, '${DATE_FORMAT}')`, 'start_date')
                             .field(`to_char(date_to, '${DATE_FORMAT}')`, 'end_date')
                             .from(this.entity.DBTable)
                             .where(`program->>0 = '${this.options.id}'`)
                             .where('time_to >= now()')
            break
          case 'facility':
          case 'facilityCategory':
            this.query = new FacilitiesQuery(this)
            break
          case 'days':
            this.query = this.postgreSQL.select().from(this.entity.DBTable)
            break
        }

        return this
      }

      where (whereClause) {
        this.query.where(whereClause)
        return this
      }

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

      field (fieldName) {
        this.query.field(fieldName)
        return this
      }

      join (joinTable, alias = null, joinClause) {
        this.query.join(joinTable, alias, joinClause)
        return this
      }

      joinPPRAssets () {
        this.query
             .join(tables.assets, null, `${tables.facilities}.website_locator_points_link_id = ${tables.assets}.linkid`)
             .field(`ST_Y(
                      ST_Centroid(${tables.assets}.the_geom)
                      ) as latitude`)
            .field(`ST_X(
              ST_Centroid(${tables.assets}.the_geom)
              ) as longitude`)
        return this
      }

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

      addWithinZipCodeField (zipcode) {
        this.query
            .field(`ST_Intersects(${tables.zipcodes}.the_geom, ${tables.assets}.the_geom) as within_zip_code`)
            .left_join(`${tables.zipcodes}`, null, `${tables.zipcodes}.code = '${zipcode}'`)

        return this
      }

      orderByMilesFromZipcode () {
        this.query
          .field(`ST_Distance(
            ST_Centroid(${tables.assets}.the_geom)::geography,
            ST_Centroid(${tables.zipcodes}.the_geom)::geography
            ) * ${METERS_TO_MILES_RATIO} as distance`)
          .order('distance')
        return this
      }

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

      addFilters (filters) {
        filters = _.omit(filters, val => _.isNull(val))
        let filterQuery = this.query
        for (let filterKey in filters) {
          if (filterKey === 'fee') {
            let _feeCompartor = filters[filterKey] === 'Free' ? '=' : '!='
            filterQuery.where(`${filterKey} ${_feeCompartor} '0.00'`)
          }
          if (filterKey === 'ages' && typeof filters[filterKey] === 'string') {
            let ages = filters[filterKey].split('-')
            filterQuery.where(`age_low >= ${ages[0]}`)
            filterQuery.where(`age_high <= ${ages[1]}`)
          }
          if (filterKey === 'gender') {
            filterQuery.where(`gender->>0 = '${filters[filterKey]}'`)
          }
          if (filterKey === 'days' && filters[filterKey].length) {
            let days = _.isArray(filters[filterKey]) ? filters[filterKey] : [filters[filterKey]]
            filterQuery.where(`ARRAY[${days.map(dayID => `'${dayID}'`)}] = ARRAY(SELECT jsonb_array_elements_text(days))`)
          }
        }
        return this
      }

      build () {
        // console.log(this.query.toString())
        return new PPRFQuery(this).queryString
      }
    }

    return Builder
  }
}
