import Api from '~/api'

const ENDPOINT = `https://phl.carto.com/api/v2/sql`
const api = new Api(ENDPOINT)

export async function getActivityCategories ({ commit }) {
  const activityCategories = await api.getActivityCategories()
  commit('SET_ACTIVITY_CATEGORIES', activityCategories)
}
