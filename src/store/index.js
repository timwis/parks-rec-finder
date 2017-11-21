import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'
// import * as getters from './getters'

import api from '@/sources/api'
import PPRFMarker from '@/store/modules/markers/Marker'
import * as types from './mutation-types'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions: {
    setActiveTab ({commit, state}, entityType) {
      let type = entityType.toLowerCase().replace('s', '')
      if (type === 'location') { type = 'facility' }
      commit(types.SET_ACTIVE_TAB, type)
      // if (state.entities.hasOwnProperty(type)) {
      // } else {
      //   console.error(`entity type "${type}"" not found in state.entities properties`)
      // }
    },

    submitSearch ({commit, state}, serachParams) {
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
  },

  state: {
    entities: {
      program: {},
      facility: {},
      activity_type: {},
      marker: {}
    },
    activeTab: '',
    search: {
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
  },

  mutations: {
    [types.SET_ACTIVE_TAB] (state, entityType) {
      state.activeTab = entityType
      state.entities.marker = state.entities[`${entityType}Markers`]
    },
    [types.UPDATE_ENTITIES] (state, { entities }) {
      state.entities = Object.assign({}, state.entities, entities)
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
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
