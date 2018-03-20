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
