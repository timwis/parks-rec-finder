import * as types from './mutation-types'

const mutations = {
  [types.APP_LOADING] (state) {
    state.loading = true
  },

  [types.APP_LOADED] (state) {
    state.loading = false
  },

  // tabs
  [types.SET_ACTIVE_TAB] (state, entityType) {
    state.activeTab = entityType
  },

  // programs
  [types.UPDATE_PROGRAMS] (state, programs) {
    state.entities.program = programs
  },
  [types.UPDATE_PROGRAM_CATEGORIES] (state, programCategories) {
    state.entities.category.program = programCategories
  },

  // facilities
  [types.UPDATE_FACILITIES] (state, facilities) {
    state.entities.facility = facilities
  },
  [types.UPDATE_FACILITY_CATEGORIES] (state, facilityCategories) {
    state.entities.category.facility = facilityCategories
  },

  // markers
  [types.UPDATE_MARKERS] (state, markers) {
    state.entities.marker = Object.assign({}, state.entities.marker, markers)
  },
  [types.SET_MAP_MARKERS] (state, {entityType}) {
    state.mapMarkers = state.entities.marker[entityType]
  },
  [types.RESET_MARKERS] (state) {
    state.mapMarkers = []
    state.entities.marker.facility = []
    state.entities.marker.program = []
  },

  // search
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
    state.search = Object.assign({}, state.search, updatedSearch)
  },

  [types.SUBMIT_SEARCH] (state, searchParams) {
    state.loading = true
    state.search.loading = true
    state.search.success = false
    state.search = searchParams
  },

  [types.RECEIVE_SEARCH_SUCCESS] (state, entities) {
    state.loading = false
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
