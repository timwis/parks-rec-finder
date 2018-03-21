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

export async function getActivities ({ commit }, { category }) {
  commit('RESET_ACTIVITY_CATEGORY_DETAILS')
  commit('RESET_ACTIVITIES')
  const activityCategoryDetails = await carto.getActivityCategoryDetails(category)
  const categoryId = activityCategoryDetails.id
  const activities = await carto.getActivities({ categoryId })
  commit('SET_ACTIVITY_CATEGORY_DETAILS', activityCategoryDetails)
  commit('SET_ACTIVITIES', activities)
}

export async function getLocations ({ commit }, { category }) {
  commit('RESET_LOCATION_CATEGORY_DETAILS')
  commit('RESET_LOCATIONS')
  const locationCategoryDetails = await carto.getLocationCategoryDetails(category)
  const categoryId = locationCategoryDetails.id
  const locations = await carto.getLocations({ categoryId })
  commit('SET_LOCATION_CATEGORY_DETAILS', locationCategoryDetails)
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
