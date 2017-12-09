import api from '@/sources/api'
import * as types from './mutation-types'
// import PPRFMarker from '@/store/modules/markers/Marker'

const actions = {

  setActiveTab ({commit, state}, entityType) {
    let type = entityType.toLowerCase().replace('s', '')
    if (type === 'location') { type = 'facility' }
    commit(types.SET_ACTIVE_TAB, type)
  },

  // resetMarkers ({commit}) {
  //   commit(types.RESET_MARKERS)
  // },

  // updateMarkers ({commit}, entityType) {
  //   commit(types.UPDATE_MARKERS, entityType)
  // },

  // setActiveMarkers ({commit}, entityList) {
  //   commit(types.UPDATE_ACIVE_MARKERS, entityType)
  // },

  updateSearchInput ({commit}, serachParams) {
    commit(types.UPDATE_SEARCH_INPUT, serachParams)
  },

  updateCategories ({commit}, {program, facility}) {
    commit(types.UPDATE_PROGRAM_CATEGORIES, program)
    commit(types.UPDATE_FACILITY_CATEGORIES, facility)
  },

  updateEntities ({commit, state}, {program, facility}) {
    if (program) {
      commit(types.UPDATE_PROGRAMS, program)
    }
    if (facility) {
      commit(types.UPDATE_FACILITIES, facility)
    }
  },

  getTerms ({commit, state}, entityType) {
    api.getTerms(entityType).then(results => {
      // console.log(results.data.rows)
      commit(types.UPDATE_ENTITIES, {entities: {activity_type: results.data.rows}})
    })
  },

  submitSearch ({commit, state}, serachParams) {
    let searchTerms = Object.assign({}, {fields: state.search.fields}, {filters: state.search.filters}, serachParams)

    commit(types.SUBMIT_SEARCH, searchTerms)

    api.search(searchTerms)
      .then(searchResults => {
        commit(types.RECEIVE_SEARCH_SUCCESS)
        let facility = searchResults[0].data.rows
        let program = searchResults[1].data.rows
        commit(types.UPDATE_PROGRAMS, program)
        commit(types.UPDATE_FACILITIES, facility)

        // let marker = {
        //   facility: searchResults[0].data.rows.map(entity => new PPRFMarker('facility', entity)),
        //   program: searchResults[1].data.rows.map(entity => new PPRFMarker('program', entity))
        // }
        // commit(types.UPDATE_MARKERS, marker)
        // commit(types.UPDATE_ACTIVE_MARKERS, {entityType: state.activeTab})
      })
      .catch((err) => {
        console.log(err)
        commit(types.RECEIVE_SEARCH_FAILURE, err)
      })
  }
}

export default actions
