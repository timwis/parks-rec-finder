/* eslint-disable no-unused-vars */
import squel from 'squel'
/* eslint-disable no-unused-vars */
import tables from './CartoDBTables'
import ProgramsQuery from './ProgramQueries'

export default class PPRFQuery {
  constructor (build) {
    this.entityType = build.entityType
    this.speed = build.speed
    this.plumage = build.plumage
    this.queryString = build.query.toString()
  }

  static get Builder () {
    class Builder {
      constructor (entityType, entityOptions) {
        this.entityType = entityType
        this.postgreSQL = squel.useFlavour('postgres')

        switch (entityType) {
          case 'program':
          case 'programs':
          case 'activities':
          case 'activitiy':
            this.query = new ProgramsQuery(this.postgreSQL, entityOptions)
            break
          case 'days':
            this.query = this.postgreSQL.select().from(tables.days)
            break
        }
      }

      // joinProgramSchedules () {
      //   this.query.join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
      //   return this
      // }

      // joinFacilites () {
      //   this.query.join(tables.facilities, null, `${tables.programs}.facility->>0 = ${tables.facilities}.id`)
      //   return this
      // }

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

      build () {
        console.log(this.query.toString())
        return new PPRFQuery(this)
      }
    }

    return Builder
  }
}

let raptor3 = new PPRFQuery.Builder('programs', {id: '57abb50bf6f0705e3051b869'})
                           .joinPPRAssets()
                           .build()
