import api from '@/sources/api'
import * as types from './mutation-types'

const actions = {

  setActiveTab ({commit, state}, entityType) {
    let type = entityType.toLowerCase().replace('s', '')
    if (type === 'location') { type = 'facility' }
    commit(types.SET_ACTIVE_TAB, type)
    commit(types.SET_MAP_MARKERS, {entityType: type})
  },
  // MARKERS
  resetMarkers ({commit}) {
    commit(types.RESET_MARKERS)
  },

  updateMarkers ({commit}, markersObj) {
    commit(types.UPDATE_MARKERS, {markersObj})
  },

  setMapMarkers ({commit}, entityType) {
    commit(types.SET_MAP_MARKERS, entityType)
  },

  // CATEGORIES
  updateCategories ({commit}, {program, facility}) {
    commit(types.UPDATE_PROGRAM_CATEGORIES, program)
    commit(types.UPDATE_FACILITY_CATEGORIES, facility)
  },

  updateEntities ({commit, state, getters}, {program, facility}) {
    if (program) {
      commit(types.UPDATE_PROGRAMS, program)
      commit(types.UPDATE_MARKERS, {program: getters.getMarkersFor('program')})
    }
    if (facility) {
      commit(types.UPDATE_FACILITIES, facility)
      commit(types.UPDATE_MARKERS, {facility: getters.getMarkersFor('facility')})
    }
  },

  // API
  getTerms ({commit, state}, entityType) {
    api.getTerms(entityType).then(results => {
      // console.log(results.data.rows)
      commit(types.UPDATE_ENTITIES, {entities: {activity_type: results.data.rows}})
    })
  },

  // SEARCH
  updateSearchInput ({commit}, serachParams) {
    commit(types.UPDATE_SEARCH_INPUT, serachParams)
  },

  submitSearch ({commit, state, getters}, serachParams) {
    let searchTerms = Object.assign({}, {fields: state.search.fields}, {filters: state.search.filters}, serachParams)
    commit(types.SUBMIT_SEARCH, searchTerms)

    api.search(searchTerms)
      .then(searchResults => {
        commit(types.RECEIVE_SEARCH_SUCCESS)
        let facility = searchResults[0].data.rows
        let program = searchResults[1].data.rows
        commit(types.UPDATE_PROGRAMS, program)
        commit(types.UPDATE_FACILITIES, facility)

        let marker = {
          facility: getters.getMarkersFor('facility'),
          program: getters.getMarkersFor('program')
        }
        commit(types.UPDATE_MARKERS, marker)
        commit(types.SET_MAP_MARKERS, {entityType: state.activeTab})
      })
      .catch((err) => {
        console.log(err)
        commit(types.RECEIVE_SEARCH_FAILURE, err)
      })
  }
}

export default actions
