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
  commit('BEGIN_REQUEST', 'getActivityCategories')
  const activityCategories = await carto.getActivityCategories()
  const activityCategoriesWithPhotos = await Promise.all(activityCategories.map(async (activity) => {
    activity.photo = await flickr.getPhotoUrl(activity.photoId)
    return activity
  }))
  commit('SET_ACTIVITY_CATEGORIES', activityCategoriesWithPhotos)
  commit('END_REQUEST', 'getActivityCategories')
}

export async function getLocationCategories ({ commit }) {
  commit('BEGIN_REQUEST', 'getLocationCategories')
  const locationCategories = await carto.getLocationCategories()
  const locationCategoriesWithPhotos = await Promise.all(locationCategories.map(async (location) => {
    location.photo = await flickr.getPhotoUrl(location.photoId)
    return location
  }))
  commit('SET_LOCATION_CATEGORIES', locationCategoriesWithPhotos)
  commit('END_REQUEST', 'getLocationCategories')
}

export async function getActivitiesByCategorySlug ({ commit, dispatch }, categorySlug) {
  commit('BEGIN_REQUEST', 'getActivitiesByCategorySlug')
  const activityCategoryDetails = await carto.getActivityCategoryDetails(categorySlug)
  commit('SET_ACTIVITY_CATEGORY_DETAILS', activityCategoryDetails)

  const categoryId = activityCategoryDetails.id
  await dispatch('getActivities', { categoryId })
  commit('END_REQUEST', 'getActivitiesByCategorySlug')
}

export async function getLocationsByCategorySlug ({ commit, dispatch }, categorySlug) {
  commit('BEGIN_REQUEST', 'getLocationsByCategorySlug')
  const locationCategoryDetails = await carto.getLocationCategoryDetails(categorySlug)
  commit('SET_LOCATION_CATEGORY_DETAILS', locationCategoryDetails)

  const categoryId = locationCategoryDetails.id
  await dispatch('getLocations', { categoryId })
  commit('END_REQUEST', 'getLocationsByCategorySlug')
}

export function resetActivitiesByCategorySlug ({ commit }) {
  commit('RESET_ACTIVITY_CATEGORY_DETAILS')
  commit('RESET_ACTIVITIES')
}

export function resetLocationsByCategorySlug ({ commit }) {
  commit('RESET_LOCATION_CATEGORY_DETAILS')
  commit('RESET_LOCATIONS')
}

export async function getActivities ({ commit }, filters) {
  commit('BEGIN_REQUEST', 'getActivities')
  const activities = await carto.getActivities(filters)
  commit('SET_ACTIVITIES', activities)
  commit('END_REQUEST', 'getActivities')
}

export async function getLocations ({ commit }, filters) {
  commit('BEGIN_REQUEST', 'getLocations')
  const locations = await carto.getLocations(filters)
  commit('SET_LOCATIONS', locations)
  commit('END_REQUEST', 'getLocations')
}

export async function getActivityDetails ({ commit }, id) {
  commit('BEGIN_REQUEST', 'getActivityDetails')
  const activityDetails = await carto.getActivityDetails(id)
  commit('SET_ACTIVITY_DETAILS', activityDetails)
  commit('END_REQUEST', 'getActivityDetails')
}

export async function getLocationDetails ({ commit }, id) {
  commit('BEGIN_REQUEST', 'getLocationDetails')
  const locationDetails = await carto.getLocationDetails(id)
  commit('SET_LOCATION_DETAILS', locationDetails)
  commit('END_REQUEST', 'getLocationDetails')
}

export function resetActivityDetails ({ commit }) {
  commit('RESET_ACTIVITY_DETAILS')
}

export function resetLocationDetails ({ commit }) {
  commit('RESET_LOCATION_DETAILS')
}

// Combined function to share the results of zipcode and address lookups
export async function searchActivitiesAndLocations ({ commit, dispatch }, filters) {
  commit('BEGIN_REQUEST', 'searchActivitiesAndLocations')
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
  commit('END_REQUEST', 'searchActivitiesAndLocations')
}

export function resetSearchActivitiesAndLocations ({ commit }) {
  commit('RESET_SEARCH_LOCATION_GEOMETRY')
  commit('RESET_ACTIVITIES')
  commit('RESET_LOCATIONS')
}

function isZipcode (value) {
  return /^\d{5}$/.test(value)
}
