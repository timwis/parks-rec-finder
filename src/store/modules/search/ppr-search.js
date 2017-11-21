import * as types from '../../mutation-types'
import api from '@/sources/api'
import PPRFMarker from '@/store/modules/markers/Marker'

const state = {
  loading: false,
  error: null,
  success: false,

  fields: {
    freetext: '',
    address: '',
    zip: 0
  },
  filters: {}
}

const getters = {}

const actions = {
  submitSearch ({state, commit}, serachParams) {
    commit(types.SUBMIT_SEARCH, serachParams.fields, serachParams.filters)

    api.search(serachParams)
        .then(searchResults => {
          commit(types.RECEIVE_SEARCH_SUCCESS, searchResults)
          let facility = searchResults[0].data.rows
          let program = searchResults[1].data.rows
          let markers = {
            facility: searchResults[0].data.rows.map(entity => new PPRFMarker('program', entity)),
            program: searchResults[1].data.rows.map(entity => new PPRFMarker('facility', entity))
          }
          let flatResults = {
            facility,
            facilityMarkers: markers.facility,
            program,
            programMarkers: markers.program,
            marker: markers[state.activeTab]
          }
          commit(types.UPDATE_ENTITIES, { entities: flatResults })
        })
        .catch((err) => {
          console.log(err)
          commit(types.RECEIVE_SEARCH_FAILURE, err)
        })
  }
}

const mutations = {
  [types.SUBMIT_SEARCH] (state, fields, filters) {
    state.loading = true
    state.success = false
    state.fields = fields
    state.filters = filters
  },

  [types.RECEIVE_SEARCH_SUCCESS] (state, rawResutlsSets) {
    state.loading = false
    state.success = true
  },

  [types.RECEIVE_SEARCH_FAILURE] (state, err) {
    state.loading = false
    state.success = false
    state.error = err
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
