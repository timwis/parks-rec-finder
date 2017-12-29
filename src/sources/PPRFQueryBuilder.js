import _ from 'underscore'
import { stringifyCoordinates } from '@/utilities/utils'

import squel from 'squel'
import tables from './CartoDBTables'

import ProgramsQuery from './ProgramQueries'
/* eslint-disable no-unused-vars */
import FacilitiesQuery from './FacilitiesQuery'
import TaxonomyQuery from './TaxonomyQuery'

const METERS_TO_MILES_RATIO = 0.000621371

export default class PPRFQuery {
  constructor (build) {
    this.entityType = build.entityType
    this.queryString = build.query.toString()
    this.queryObject = build.query
  }

  get query () {
    return this.queryString
  }

  static get Builder () {
    class Builder {
      constructor (entityType, entityOptions) {
        this.entityType = entityType
        this.postgreSQL = squel.useFlavour('postgres')
        this.options = entityOptions
        switch (entityType) {
          case 'program':
          case 'programs':
          case 'activities':
          case 'activitiy':
            this.DBtable = tables.programs
            this.query = new ProgramsQuery(this)
            break
          case 'programsCategory':
          case 'activitiesCategory':
            this.DBtable = tables.programs
            this.query = new ProgramsQuery(this)
            this.fields([
              'program_name_full',
              `id`,
              'program_id',
              'activity_type',
              'program_name',
              'program_description',
              'age_low',
              'age_high',
              'fee',
              {'gender->>0': 'gender'}
            ])
            this.query
                .join(tables.programCategories, 'category', `category.id = ${this.DBtable}.activity_category->>0`)
                .field(`category`)
                .where(`category.activity_category_name = '${this.options.term}'`)

            break
          case 'programsCategories':
          case 'programCategories':
          case 'activitiesCategories':
          case 'activityCategories':
            this.entityType = 'programs'
            this.DBtable = tables.programCategories
            this.query = new TaxonomyQuery(this)
            break
          case 'programDays':
          case 'programScheduleDays':
            this.query = this.postgreSQL
                             .select()
                             .from(`(SELECT program, jsonb_array_elements_text(${tables.programSchedules}.days) _daysID FROM ${tables.programSchedules})`, 'a')
                             .join(tables.days, 'b', 'b.id = a._daysID')
                             .where(`program->>0 = '${this.options.id}'`)
            break
          case 'locations':
          case 'location':
          case 'facilities':
          case 'facility':
          case 'places':
            this.entityType = 'facility'
            this.DBtable = tables.facilities
            this.query = new FacilitiesQuery(this)
            break
          case 'locationsCategories':
          case 'locationCategories':
          case 'facilitiesCategories':
          case 'facilityCategories':
          case 'placesCategories':
            this.entityType = 'facilities'
            this.DBtable = tables.locationCategories
            this.query = new TaxonomyQuery(this)
            break
          case 'locationsCategory':
          case 'facilitiesCategory':
          case 'placesCategory':
            this.entityType = 'facilities'
            this.DBtable = tables.facilities
            this.query = new FacilitiesQuery(this)
            this.query
                .join(tables.locationCategories, null, `${tables.locationCategories}.id = ${this.DBtable}.location_type->>0`)
                .where(`location_type_name = '${this.options.term}'`)
            break
          case 'days':
            this.DBtable = tables.days
            this.query = this.postgreSQL.select().from(this.DBtable)
            break
        }
      }

      where (whereClause) {
        this.query.where(whereClause)
        return this
      }

      fields (fieldDefs) {
        if (_.isArray(fieldDefs)) {
          fieldDefs.forEach(field => {
            if (_.isObject(field)) {
              this.query.field(`${this.DBtable}.${Object.keys(field)[0]}`, Object.values(field)[0])
            } else {
              this.query.field(`${this.DBtable}.${field}`)
            }
          })
        }

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
        return new PPRFQuery(this)
      }
    }

    return Builder
  }
}
