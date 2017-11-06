import axios from 'axios'
import squel from 'squel'


class cartoAPI {

    constructor (httpClient, sqlQueryBuilder) {
      // set our api base
      this.http = httpClient.create({baseURL: process.env.CARTO_API.BASE})
      this.sqlQuery = sqlQueryBuilder
    }

    /**
     * GET SQL query results from the Cart API
     * @param  {string} sqlString - SQL Query
     * @return {object}           Prmoise Object with raw results
     */
    get (sqlString) {
      return this.sqlQueryBuilder.get(`sql?q=${sqlString}`)
    }

    /**
     * Given freetext and address values
     * return a list of PPR Facilites sorted by relative distance
     * @param  {object} serachParams - UI serach field key values paris
     * @param  {string} coords - latitiude and longitude of address search field value
     * @return {[type]}              [description]
     */
    search (serachParams, coords = (coords ? coords.join(',') : null)) {

    }
}





export default new _cartoAPI(axios, squel)


