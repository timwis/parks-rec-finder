import tables from './CartoDBTables'
import QueryInterface from './QueryInterface'

export default class ZipQuery extends QueryInterface {
  constructor (Builder) {
    super(Builder)
    this.build = Builder
    const zip = this.build.options.zip
    return this.query
      .field('code')
      .field('st_asgeojson(st_centroid(the_geom))::json', 'centroid')
      .from(tables.zipcodes)
      .where('code = ?', zip)
  }
}
