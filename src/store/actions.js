import Carto from '~/api/carto'
import AIS from '~/api/ais'
import Flickr from '~/api/flickr'
import {
  CARTO_ENDPOINT,
  AIS_ENDPOINT,
  AIS_API_KEY,
  FLICKR_ENDPOINT,
  FLICKR_API_KEY
} from '~/config'

const carto = new Carto(CARTO_ENDPOINT)
const ais = new AIS(AIS_ENDPOINT, AIS_API_KEY)
const flickr = new Flickr(FLICKR_ENDPOINT, FLICKR_API_KEY)

export default {
  async getActivityCategories ({ commit }) {
    const activityCategories = await carto.getActivityCategories()
    const activityCategoriesWithPhotos = await Promise.all(activityCategories.map(getPhotoUrl))
    commit('SET_ACTIVITY_CATEGORIES', activityCategoriesWithPhotos)
  },

  async getLocationCategories ({ commit }) {
    const locationCategories = await carto.getLocationCategories()
    const locationCategoriesWithPhotos = await Promise.all(locationCategories.map(getPhotoUrl))
    commit('SET_LOCATION_CATEGORIES', locationCategoriesWithPhotos)
  },

  async getActivitiesByCategorySlug ({ commit, dispatch }, categorySlug) {
    const activityCategoryDetails = await carto.getActivityCategoryDetails(categorySlug)
    commit('SET_ACTIVITY_CATEGORY_DETAILS', activityCategoryDetails)

    const categoryId = activityCategoryDetails.id
    await dispatch('getActivities', { categoryId })
  },

  async getLocationsByCategorySlug ({ commit, dispatch }, categorySlug) {
    const locationCategoryDetails = await carto.getLocationCategoryDetails(categorySlug)
    commit('SET_LOCATION_CATEGORY_DETAILS', locationCategoryDetails)

    const categoryId = locationCategoryDetails.id
    await dispatch('getLocations', { categoryId })
  },

  resetActivitiesByCategorySlug ({ commit }) {
    commit('RESET_ACTIVITY_CATEGORY_DETAILS')
    commit('RESET_ACTIVITIES')
  },

  resetLocationsByCategorySlug ({ commit }) {
    commit('RESET_LOCATION_CATEGORY_DETAILS')
    commit('RESET_LOCATIONS')
  },

  async getActivities ({ commit }, filters) {
    const activities = await carto.getActivities(filters)
    commit('SET_ACTIVITIES', activities)
  },

  async getLocations ({ commit }, filters) {
    const locations = await carto.getLocations(filters)
    commit('SET_LOCATIONS', locations)
  },

  async getActivityDetails ({ commit }, id) {
    const activityDetails = await carto.getActivityDetails(id)
    commit('SET_ACTIVITY_DETAILS', activityDetails)
  },

  async getLocationDetails ({ commit }, id) {
    const locationDetails = await carto.getLocationDetails(id)
    commit('SET_LOCATION_DETAILS', locationDetails)
  },

  resetActivityDetails ({ commit }) {
    commit('RESET_ACTIVITY_DETAILS')
  },

  resetLocationDetails ({ commit }) {
    commit('RESET_LOCATION_DETAILS')
  },

  // Combined function to share the results of zipcode and address lookups
  async searchActivitiesAndLocations ({ commit, dispatch }, filters) {
    if (filters.searchLocation) {
      filters.searchLocationGeometry = (isZipcode(filters.searchLocation))
        ? await carto.getZipcodeGeometry(filters.searchLocation)
        : await ais.getAddressGeometry(filters.searchLocation)

      commit('SET_SEARCH_LOCATION_GEOMETRY', filters.searchLocationGeometry)
    }

    await Promise.all([
      dispatch('getActivities', filters),
      dispatch('getLocations', filters)
    ])
  },

  resetSearchActivitiesAndLocations ({ commit }) {
    commit('RESET_SEARCH_LOCATION_GEOMETRY')
    commit('RESET_ACTIVITIES')
    commit('RESET_LOCATIONS')
  }
}

async function getPhotoUrl (category) {
  try {
    category.photo = await flickr.getPhotoUrl(category.photoId)
  } catch (err) {
    // Suppress error and continue
    console.error(err.message, category.photoId)
  }
  return category
}

function isZipcode (value) {
  return /^\d{5}$/.test(value)
}
