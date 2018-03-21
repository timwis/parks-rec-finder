import Carto from '~/api/carto'

const CARTO_ENDPOINT = `https://phl.carto.com/api/v2/sql`
const carto = new Carto(CARTO_ENDPOINT)

export async function getActivityCategories ({ commit }) {
  const activityCategories = await carto.getActivityCategories()
  commit('SET_ACTIVITY_CATEGORIES', activityCategories)
}

export async function getLocationCategories ({ commit }) {
  const locationCategories = await carto.getLocationCategories()
  commit('SET_LOCATION_CATEGORIES', locationCategories)
}

export async function getActivityCategoryDetails ({ commit }, categorySlug) {
  commit('RESET_ACTIVITY_CATEGORY_DETAILS')
  const activityCategoryDetails = await carto.getActivityCategoryDetails(categorySlug)
  commit('SET_ACTIVITY_CATEGORY_DETAILS', activityCategoryDetails)
}

export async function getLocationCategoryDetails ({ commit }, categorySlug) {
  commit('RESET_LOCATION_CATEGORY_DETAILS')
  const locationCategoryDetails = await carto.getLocationCategoryDetails(categorySlug)
  commit('SET_LOCATION_CATEGORY_DETAILS', locationCategoryDetails)
}

export async function getActivities ({ commit }, { categoryId, term }) {
  commit('RESET_ACTIVITIES')
  const activities = await carto.getActivities({ categoryId, term })
  commit('SET_ACTIVITIES', activities)
}

export async function getLocations ({ commit }, { categoryId, term }) {
  commit('RESET_LOCATIONS')
  const locations = await carto.getLocations({ categoryId, term })
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
