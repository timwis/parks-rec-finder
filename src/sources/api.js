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
  let facilitiesSearchQuery = cartoAPI.getFacilities(searchParams.fields.freetext, coords, searchParams.fields.zip)
  let programsSearchQuery = cartoAPI.getPrograms(searchParams.fields.freetext, coords, searchParams.fields.zip, searchParams.filters)
  return Promise.all([facilitiesSearchQuery, programsSearchQuery])
}

const getTaxonomy = (entityType) => {
  switch (entityType) {
    case 'programs':
      entityType = 'Activity'
      break
    case 'locations':
      entityType = 'Location'
      break
  }
  let taxonomyTermsQueryString = cartoAPI.getEntityTaxonomy(entityType)
  return cartoAPI.runQuery(taxonomyTermsQueryString)
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

  if (fields && (fields.address && fields.address !== null && fields.address !== '')) {
    return aisAPI.getCoordsForAddress(fields.address)
                 .then(searchCarto.bind({}, serachParams))
  } else {
    return searchCarto(serachParams, null)
  }
}

class API {
  search (searchParams) {
    return search(searchParams)
  }
  getTaxonomyFor (entityType) {
    return getTaxonomy(entityType)
  }
  getTaxonomyTerms (entity) {
    return cartoAPI.runQuery(cartoAPI.getEntityTaxonomyTerms(entity))
  }
}

export default new API()
