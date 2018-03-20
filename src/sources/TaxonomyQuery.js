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
          .with(`activity_categories_tmp`, squel.useFlavour('postgres')
            .select()
            .field(`jsonb_array_elements(activity_category)->>0 as activity_category`)
            .from(`ppr_programs`)
            .where(`program_is_public`)
            .where(`program_is_approved`)
            .where(`program_is_active`)
          )
          .field(`count(*)`, `count`)
          .field(`activity_category_name`)
          .field(`activity_category_description`)
          .field(`activity_category_photo`)
          .from(`activity_categories_tmp`)
          .left_join(`ppr_activity_categories`, null, `ppr_activity_categories.id = activity_categories_tmp.activity_category`)
          .where(`activity_category_is_published`)
          .group(`activity_category_name,
                  activity_category_description,
                  activity_category_photo`)
          .order(`count`, false)
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
