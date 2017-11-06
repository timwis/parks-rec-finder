import {cartoAPI} from './CartoAPI'
import {aisAPI} from './AISAPI'

/**
 * Given freetext and coordinate serach values
 * query the Carto API to return a list of
 * PPR Facilites sorted by relative distance to coordinates
 * @param  {object} searchParams - UI search fields key value pairs
 * @param  {string} coords  - comma separated latitude and longitude
 * @return {object}              Promise resolving with query results
 *
 * @since 0.0.0
 */
const searchCarto = (searchParams, coords) => {
  let addressSearchQuery = cartoAPI.queryProgramsBy(searchParams.fields.freetext, coords)
  return cartoAPI.runQuery(addressSearchQuery)
}
/**
 * Address search implemented using the AIS and Carto APIs
 * @param  {object} searchParams - UI search fields key value pairs
 * @return {object}              Promise resolving with query results
 *
 * @since 0.0.0
 */
const search = (serachParams) => {
  let fields = serachParams.fields

  if (fields.address !== null && fields.address !== '') {
    return aisAPI.getCoordsForAddress(fields.address)
                 .then(searchCarto.bind({}, serachParams))
  } else {
    return searchCarto(serachParams, null)
  }
}

export default search
