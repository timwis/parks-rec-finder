import * as types from './mutation-types'

const mutations = {
  // LOADING
  [types.APP_LOADING] (state) {
    state.loading = true
  },

  [types.APP_LOADED] (state) {
    state.loading = false
  },

  // TABS
  [types.SET_ACTIVE_TAB] (state, entityType) {
    state.activeTab = entityType
  },

  // ENTITY: PROGRAMS
  [types.UPDATE_PROGRAMS] (state, programs) {
    state.entities.program = programs
  },
  [types.UPDATE_PROGRAM_CATEGORIES] (state, programCategories) {
    state.entities.category.program = programCategories
  },

  // ENTITY: FACILITIES
  [types.UPDATE_FACILITIES] (state, facilities) {
    state.entities.facility = facilities
  },
  [types.UPDATE_FACILITY_CATEGORIES] (state, facilityCategories) {
    state.entities.category.facility = facilityCategories
  },

  // ENTITY: MARKERS
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

  // SEARCH
  // [types.UPDATE_SEARCH_INPUT] (state, {fields, filters}) {
  //   let _filters = filters || state.search.filters
  //   let updatedSearch = {
  //     fields: {
  //       freetext: fields ? fields.freetext : state.search.fields.freetext,
  //       address: fields ? fields.address : state.search.fields.address,
  //       zip: fields ? fields.zip : state.search.fields.zip
  //     },
  //     filters: _filters
  //   }
  //   state.search = Object.assign({}, state.search, updatedSearch)
  // },

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
  },

  [types.RECEIVE_SEARCH_LOCATION] (state, coords) {
    console.log('Setting search location', coords)
    state.searchLocation = coords
  },

  // MOBILE
  [types.TOGGLE_MOBILE_SEARCH] (state, {open}) {
    /* eslint-disable  space-unary-ops */
    state.mobile.searchOpen = typeof(open) === 'undefined' ? !state.mobile.searchOpen : open.open
  },
  [types.TOGGLE_MOBILE_FILTERS] (state, toggleState) {
    if (toggleState !== 'undefined') {
      state.mobile.filtersOpen = toggleState
    } else {
      state.mobile.filtersOpen = !state.mobile.filtersOpen
    }
  },
  [types.SET_MOBILE_VIEW] (state, view) {
    state.mobile.listView = view
  },
  [types.TOGGLE_MOBILE_NAV] (state) {
    state.mobile.navOpen = !state.mobile.navOpen
  },

  // MODALS
  [types.TOGGLE_MODAL] (state, {name, open}) {
    state.modals[name].open = open === null ? !state.modals[name].open : open
  },
  [types.CLOSE_MODALS] (state) {
    for (let modalName in state.modals) {
      state.modals[modalName].open = false
    }
  }
}

export default mutations
