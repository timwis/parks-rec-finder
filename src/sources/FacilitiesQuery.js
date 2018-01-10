import tables from './CartoDBTables'
import QueryInterface from './QueryInterface'

export default class FacilitiesQuery extends QueryInterface {
  constructor (Builder) {
    super(Builder)

    this.build = Builder
    this.options = this.build.options
    this.query
        .field(`${tables.facilities}.*`)
        .from(tables.facilities)
    this.defineQuery()
    return this.query
  }

  defineQuery () {
    if (this.options && this.options.id) {
      this.query = this.getRowsByID(this.options.id)
    } else {
      this.query = this.getAllRows()
    }
  }

  getAllRows () {
    return this.query
  }

  getRowsByID (id) {
    return this.query
                .field('address')
                .field(`ARRAY(SELECT ${tables.programs}.program_name FROM ${tables.programs} WHERE ${tables.programs}.facility->>0 = ${tables.facilities}.id)`,
                            'programs')
                .where(`${tables.facilities}.id = '${id}'`)
  }
}
