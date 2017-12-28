import tables from './CartoDBTables'
import QueryInterface from './QueryInterface'

export default class ProgramsQuery extends QueryInterface {
  constructor (Builder) {
    super(Builder)

    this.build = Builder
    this.options = this.build.options

    this.query
        .field('facility_name')
        .field(`gender->>0`, 'gender')
        .from(tables.programs)

    this.defineQuery()

    return this.query
  }

  defineQuery () {
    this.query = ProgramsQuery.joinWithAggregateData(this.query)
    this.query = ProgramsQuery.isPublished(this.query)
    if (this.options && this.options.id) {
      this.query = this.getRowsByID(this.options.id)
    } else {
      this.query = this.getAllRows()
    }
  }

  getAllRows () {
    return this.query
                .field('days')
                .field('address', 'facility_address')
                .field(`facility->>0`, 'facility_id')
  }

  getRowsByID (id) {
    return this.query
                .field('address')
                .field(`to_char(date_from, 'Month DD, YYYY')`, 'start_date')
                .field(`to_char(date_to, 'Month DD, YYYY')`, 'end_date')
                .field(`${tables.facilities}.id`, 'location_id')
                .where(`${tables.programs}.id = '${id}'`)
  }

  static joinWithAggregateData (query) {
    return query.join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
                .join(tables.facilities, null, `${tables.programs}.facility->>0 = ${tables.facilities}.id`)
  }

  static isPublished (query) {
    return query
            .where('program_is_public')
            // .where('program_is_approved')
  }
}
