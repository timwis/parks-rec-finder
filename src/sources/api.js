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

class API {
  /**
 * Address search implemented using the AIS and Carto APIs
 * @param  {object} searchParams - UI search fields key value pairs
 * @return {object}              Promise resolving with query results
 *
 * @since 0.0.0
 */
  search (serachParams) {
    let {fields} = serachParams

    if (fields && (fields.address && fields.address !== null && fields.address !== '')) {
      return aisAPI.getCoordsForAddress(fields.address)
                   .then(searchCarto.bind({}, serachParams))
    } else {
      return searchCarto(serachParams, null)
    }
  }

  getTaxonomyFor (entityType) {
    switch (entityType) {
      case 'programs':
        entityType = 'Activity'
        break
      case 'locations':
        entityType = 'Location'
        break
    }
    return cartoAPI.getEntityTaxonomy(entityType)
  }

  getTaxonomyTerms (entity, filters) {
    if (entity.entityType === 'locations') {
      entity.entityType = 'facilities'
    }

    return cartoAPI.getEntityTaxonomyTerms(entity, filters)
  }

  getProgramByProgramID (programID) {
    return cartoAPI.getProgramByProgramID(programID)
  }
}

export default new API()
