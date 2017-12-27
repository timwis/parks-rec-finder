import tables from './CartoDBTables'

export default class ProgramsQuery {
  constructor (SQLQuery, options = null) {
    this.query = SQLQuery
                  .select()
                  .field(`${tables.programs}.*`)
                  .field('facility_name')
                  .from(tables.programs)

    if (options && options.id) {
      this.query = this.getRowsByID(options.id)
    } else {
      this.query = this.getAllRows()
    }

    return this.query
               .join(tables.programSchedules, null, `${tables.programSchedules}.program->>0 = ${tables.programs}.id`)
               .join(tables.facilities, null, `${tables.programs}.facility->>0 = ${tables.facilities}.id`)
               .where('program_is_public')
  }

  getAllRows () {
    return this.query
                .field(`${tables.programs}.gender->>0`, 'gender')
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
}
