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

  [types.UPDATE_SEARCH_INPUT] (state, {fields, filters}) {
    let _filters = filters || state.search.filters
    let updatedSearch = {
      fields: {
        freetext: fields ? fields.freetext : state.search.fields.freetext,
        address: fields ? fields.address : state.search.fields.address,
        zip: fields ? fields.zip : state.search.fields.zip
      },
      filters: _filters
    }
    state.search = updatedSearch
  },

  [types.SUBMIT_SEARCH] (state, searchParams) {
    state.search.loading = true
    state.search.success = false
    state.search = searchParams
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
