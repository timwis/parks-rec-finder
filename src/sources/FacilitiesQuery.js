import squel from 'squel'
import tables from './CartoDBTables'
import QueryInterface from './QueryInterface'

export default class FacilitiesQuery extends QueryInterface {
  constructor (Builder) {
    super(Builder)

    this.build = Builder
    this.options = this.build.options
    this.query
      .with(`facility_location_types_tmp`, squel.useFlavour('postgres')
        .select()
        .field(`ppr_facilities.id`)
        .from(`ppr_facilities`)
        .from(`jsonb_array_elements_text(ppr_facilities.location_type) as exploded_location_type`)
        .left_join(`ppr_location_types`, null, `ppr_location_types.id = exploded_location_type`)
        .where(`lower(ppr_location_types.location_type_name) = ?`, this.options.term)
      )
      .field(`ppr_facilities.*`)
      .from(`facility_location_types_tmp`)
      .join(`ppr_facilities`, null, `ppr_facilities.id = facility_location_types_tmp.id`)
    this.query = FacilitiesQuery.isPublished(this.query)

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
    return this.query.field('location_contact_name')
  }

  getRowsByID (id) {
    return this.query
                .field('address')
                .field('location_contact_name')
                .field(`ARRAY(SELECT ${tables.programs}.program_name FROM ${tables.programs} WHERE ${tables.programs}.facility->>0 = ${tables.facilities}.id)`, 'programs')
                .where(`${tables.facilities}.id = '${id}'`)
  }

  static isPublished (query) {
    return query.where('facility_is_published')
  }
}
