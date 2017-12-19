import {cartoAPI} from './CartoAPI'
import {aisAPI} from './AISAPI'
/* eslint-disable no-unused-vars */
import {flickrAPI} from './FlickrAPI'
import _ from 'underscore'

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
    debugger
    let {fields} = serachParams
    if (fields && (fields.address && fields.address !== null && fields.address !== '')) {
      return aisAPI.getCoordsForAddress(fields.address)
                   .then(searchCarto.bind({}, serachParams))
    } else {
      return searchCarto(serachParams, null)
    }
  }

  _mapFlickPhotosToResults (resultsSet, photoProp) {
    let categories = resultsSet.data.rows
    // @TODO switch to use actual values
    let photoRequests = categories.map(category => flickrAPI.getSizes('37737634971'))
    return Promise.all(photoRequests).then(photoResults => {
      // @TODO map to use more than one size for responsive images on the front-end
      let photos = photoResults.map(resutlsData => resutlsData.data.sizes.size[5].source)
      categories.forEach((category, idx) => { category[photoProp] = photos[idx] })
      return categories
    })
  }

  getDays () {
    return cartoAPI.getDays()
  }

  getTaxonomyTerms ({taxonomy}) {
    let programsTaxonomyTerms = cartoAPI
                                  .getEntityTaxonomy({entityType: 'programs', taxonomy})
                                  .then(categoryResults => this._mapFlickPhotosToResults(categoryResults, 'activity_category_photo'))
    let locationsTaxonomyTerms = cartoAPI
                                  .getEntityTaxonomy({entityType: 'locations', taxonomy})
                                  .then(categoryResults => this._mapFlickPhotosToResults(categoryResults, 'location_type_photo'))
    return Promise.all([programsTaxonomyTerms, locationsTaxonomyTerms])
  }

  getTaxonomyTermEntities (entity, filters) {
    return cartoAPI.getTaxonomyTermEntities(entity, filters)
  }

  getProgramByID (programID) {
    let programQuery = cartoAPI.getProgramByID(programID)
    let daysQuery = cartoAPI.getProgramDays(programID)
    return Promise.all([programQuery, daysQuery])
  }

  getFacilityByID (facilityID) {
    let facilityQuery = cartoAPI.getFacilityByID(facilityID)
    let facilityProgramsQuery = cartoAPI.getProgramsByFacilityID(facilityID)
    return Promise.all([facilityQuery, facilityProgramsQuery])
  }
}

export default new API()
