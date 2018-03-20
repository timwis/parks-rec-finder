import {cartoAPI} from './CartoAPI'
import {aisAPI} from './AISAPI'
import {flickrAPI} from './FlickrAPI'

/**
 * Primary REST-like API layer for the application that is consumed by the store and
 * calls in containers. This is here to act as an aggregate API to make
 * request for data in the font-end cleaner.
 *
 * @since 0.1.0
 */
class API {
  /**
 * Execute search on Carto tables
 * @param  {object} searchParams - UI search fields key value pairs
 * @param  {array?} coords - longitude, latitude
 * @return {object}              Promise resolving with query results
 *
 * @since 0.1.0
 */
  search (searchParams, coords) {
    return cartoAPI.search(searchParams, coords)
  }

  geocodeAddress (address) {
    return aisAPI.getCoordsForAddress(address)
  }

  geocodeZip (zip) {
    return cartoAPI.getZipCentroid(zip)
  }

  /**
   * Given the reusltsSet and a flickr photo id property
   * return a new results set with the phtotos populated from the flickr api
   * @param  {array} resultsSet ppr category objects array from the Carto API
   * @param  {string} photoProp  property on category object to populate photo url to
   *
   * @return {object}  Promise, resolving when phpoto requests are returned
   *
   * @since 0.1.0
   */
  _mapFlickPhotosToResults (resultsSet, photoProp) {
    let categories = resultsSet.data.rows
    let photoRequests = categories.map(category => flickrAPI.getSizes(category[photoProp]))
    return Promise.all(photoRequests).then(photoResults => {
      // @TODO map to use more than one size for responsive images on the front-end
      let photos = photoResults.map(resutlsData => resutlsData.data.sizes ? resutlsData.data.sizes.size[5].source : '')
      categories.forEach((category, idx) => { category[photoProp] = photos[idx] })
      return categories
    })
  }

  /**
   * fetch photos from the ppr_days table
   * @return {object} Promise resolving with resutls from ppr_days query
   *
   * @since 0.1.0
   */
  getDays () {
    return cartoAPI.getDays()
  }

  /**
   * Given a taxonomy name get a list of of programs and locations
   * taxonomy terms populated with flickr photos
   * @param  {string} options.taxonomy name of taxonomy
   *
   * @return {object}    Promise, resolving with data from programs and locations category terms
   *
   * @since 0.1.0
   */
  getTaxonomyTerms ({taxonomy}) {
    let programsTaxonomyTerms = cartoAPI
                                  .getEntityTaxonomy({entityType: 'programs', taxonomy})
                                  .then(categoryResults => this._mapFlickPhotosToResults(categoryResults, 'activity_category_photo'))
    let locationsTaxonomyTerms = cartoAPI
                                  .getEntityTaxonomy({entityType: 'locations', taxonomy})
                                  .then(categoryResults => this._mapFlickPhotosToResults(categoryResults, 'location_type_photo'))
    return Promise.all([programsTaxonomyTerms, locationsTaxonomyTerms])
  }

  /**
   * Given an entity type, taxonomy term, and it's associated set of filters
   * return a list of all the entities with that taxonomy term
   * @param  {object} entity  {
   *                          entityType: {string},
   *                          entityTerm: {string} taxonomy term
   *                          }
   * @param  {object} filters key value set of filters
   *
   * @return {object}         Promise, resolves with array of entities
   *
   * @since 0.1.0
   */
  getTaxonomyTermEntities (entity, filters) {
    return cartoAPI.getTaxonomyTermEntities(entity, filters)
  }

  // entityType is program or facility. entityTerm is the category
  getTaxonomyTermId (entityType, entityTerm) {
    return cartoAPI.getTaxonomyTermId(entityType, entityTerm)
  }

  /**
   * Given a program.id return the program entity
   * and it's associated program schedule
   * @param  {string} programID program.id
   *
   * @return {object}           Promise, resolves with program entity list and assoicated program schedule data
   *
   * @since 0.1.0
   */
  getProgramByID (programID) {
    // let daysQuery = cartoAPI.getProgramDays(programID)
    let schedulesQuery = cartoAPI.getProgramSchedules(programID)
    let programQuery = cartoAPI.getProgramByID(programID)
    return Promise.all([programQuery, schedulesQuery])
  }

  /**
   * Given a facility id get a facility entity
   * and all the programs at that facility
   * @param  {string} facilityID facility entity id
   *
   * @return {object}            Promise
   *
   * @since 0.1.0
   */
  getFacilityByID (facilityID) {
    let facilityQuery = cartoAPI.getFacilityByID(facilityID)
    let facilitySchedulesQuery = cartoAPI.getFacilitySchedules(facilityID)
    let facilityProgramsQuery = cartoAPI.getProgramsByFacilityID(facilityID)
    return Promise.all([facilityQuery, facilityProgramsQuery, facilitySchedulesQuery])
  }
}

export default new API()
