import * as types from './mutation-types'

const mutations = {

  [types.SET_ACTIVE_TAB] (state, entityType) {
    state.activeTab = entityType
  },

  [types.UPDATE_ENTITIES] (state, { entities }) {
    state.entities = Object.assign({}, state.entities, entities)
  },

  [types.UPDATE_MARKERS] (state, {entityType}) {
    state.activeMarkers = state.entities.marker[entityType]
  },

  [types.SUBMIT_SEARCH] (state, fields, filters) {
    state.search.loading = true
    state.search.success = false
    state.search.fields = fields
    state.search.filters = filters
  },

  [types.RECEIVE_SEARCH_SUCCESS] (state, rawResutlsSets) {
    state.search.loading = false
    state.search.success = true
  },

  [types.RECEIVE_SEARCH_FAILURE] (state, err) {
    state.search.loading = false
    state.search.success = false
    state.search.error = err
  }
}

export default mutations
