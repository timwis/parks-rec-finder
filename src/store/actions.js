import Carto from '~/api/carto'
import AIS from '~/api/ais'
import Flickr from '~/api/flickr'

const CARTO_ENDPOINT = 'https://phl.carto.com/api/v2/sql'
const carto = new Carto(CARTO_ENDPOINT)

const AIS_ENDPOINT = 'https://api.phila.gov/ais/v1/'
const AIS_API_KEY = 'aeec9db5c3d2033149545595dd31c4bf'
const ais = new AIS(AIS_ENDPOINT, AIS_API_KEY)

const FLICKR_ENDPOINT = 'https://api.flickr.com/services/rest'
const FLICKR_API_KEY = 'd725fbb674d097510cba546d70aa0244'
const flickr = new Flickr(FLICKR_ENDPOINT, FLICKR_API_KEY)

export async function getActivityCategories ({ commit }) {
  const activityCategories = await carto.getActivityCategories()
  const activityCategoriesWithPhotos = await Promise.all(activityCategories.map(async (activity) => {
    activity.photo = await flickr.getPhotoUrl(activity.photoId)
    return activity
  }))
  commit('SET_ACTIVITY_CATEGORIES', activityCategoriesWithPhotos)
}

export async function getLocationCategories ({ commit }) {
  const locationCategories = await carto.getLocationCategories()
  const locationCategoriesWithPhotos = await Promise.all(locationCategories.map(async (location) => {
    location.photo = await flickr.getPhotoUrl(location.photoId)
    return location
  }))
  commit('SET_LOCATION_CATEGORIES', locationCategoriesWithPhotos)
}

export async function getActivitiesByCategorySlug ({ commit, dispatch }, categorySlug) {
  commit('RESET_ACTIVITY_CATEGORY_DETAILS')
  const activityCategoryDetails = await carto.getActivityCategoryDetails(categorySlug)
  commit('SET_ACTIVITY_CATEGORY_DETAILS', activityCategoryDetails)

  const categoryId = activityCategoryDetails.id
  dispatch('getActivities', { categoryId })
}

export async function getLocationsByCategorySlug ({ commit, dispatch }, categorySlug) {
  commit('RESET_LOCATION_CATEGORY_DETAILS')
  const locationCategoryDetails = await carto.getLocationCategoryDetails(categorySlug)
  commit('SET_LOCATION_CATEGORY_DETAILS', locationCategoryDetails)

  const categoryId = locationCategoryDetails.id
  dispatch('getLocations', { categoryId })
}

export async function getActivities ({ commit }, filters) {
  commit('RESET_ACTIVITIES')
  const activities = await carto.getActivities(filters)
  commit('SET_ACTIVITIES', activities)
}

export async function getLocations ({ commit }, filters) {
  commit('RESET_LOCATIONS')
  const locations = await carto.getLocations(filters)
  commit('SET_LOCATIONS', locations)
}

export async function getActivity ({ commit }, id) {
  commit('RESET_ACTIVITY')
  const activity = await carto.getActivity(id)
  commit('SET_ACTIVITY', activity)
}

export async function getLocation ({ commit }, id) {
  commit('RESET_LOCATION')
  const location = await carto.getLocation(id)
  commit('SET_LOCATION', location)
}

// Combined function to share the results of zipcode and address lookups
export async function searchActivitiesAndLocations ({ commit, dispatch }, filters) {
  if (filters.searchLocation) {
    commit('RESET_SEARCH_LOCATION_GEOMETRY')

    filters.searchLocationGeometry = (isZipcode(filters.searchLocation))
      ? await carto.getZipcodeGeometry(filters.searchLocation)
      : await ais.getAddressGeometry(filters.searchLocation)

    commit('SET_SEARCH_LOCATION_GEOMETRY', filters.searchLocationGeometry)
  }

  dispatch('getActivities', filters)
  dispatch('getLocations', filters)
}

function isZipcode (value) {
  return /^\d{5}$/.test(value)
}
