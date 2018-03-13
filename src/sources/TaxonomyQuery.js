/* eslint-disable no-unused-vars */
import squel from 'squel'
import tables from './CartoDBTables'
import QueryInterface from './QueryInterface'
import ProgramsQuery from './ProgramQueries'
import FacilitiesQuery from './FacilitiesQuery'

export default class TaxonomyQuery extends QueryInterface {
  constructor (Builder) {
    super(Builder)
    this.tableAlias = this.build.entity.DBTable
    this.defineQuery()

    return this.query
  }

  defineQuery () {
    switch (this.build.entity.name) {
      case 'programCategories':
        this.query
            .field('count(*)', 'count')
            .field(`${this.tableAlias}.activity_category_name`)
            .field(`${this.tableAlias}.activity_category_description`)
            .field(`${this.tableAlias}.activity_category_photo`)
            .from(this.build.entity.DBTable, this.tableAlias)
            .where('activity_category_is_published')
            .join(tables.programs, null, `${tables.programs}.activity_category->>0 = ${this.tableAlias}.id`)
        this.query = ProgramsQuery.joinWithAggregateData(this.query)
        this.query = ProgramsQuery.isPublished(this.query)
            .join(tables.assets, null, `${tables.facilities}.website_locator_points_link_id = ${tables.assets}.linkid`)
            .group(`${this.tableAlias}.activity_category_name, ${this.tableAlias}.activity_category_description, ${this.tableAlias}.activity_category_photo, ${tables.facilities}.facility_is_published`)
            .order('count', false)
            .order('activity_category_name')

        break
      case 'facilityCategories':
        this.query
          .with(`facility_location_types_tmp`, squel.useFlavour('postgres')
            .select()
            .field('jsonb_array_elements(location_type)->>0 as location_type')
            .from('ppr_facilities')
            .where(`facility_is_published`)
          )
          .field('count(*)', 'count')
          .field(`location_type`)
          .field(`location_type_name`)
          .field(`location_type_description`)
          .field(`location_type_photo`)
          .from(`facility_location_types_tmp`)
          .left_join(`ppr_location_types`, null, `facility_location_types_tmp.location_type = ppr_location_types.id`)
          .where(`location_type_is_published`)
          .group(`location_type,
                  location_type_name,
                  location_type_description,
                  location_type_photo`)
         .order('count', false)
    }
  }
}
