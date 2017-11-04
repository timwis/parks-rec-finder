import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/sources/api'

// import * as actions from './actions'
// import * as getters from './getters'
// import programs from './modules/cart'
// import locations from './modules/products'
// import search from './modules/search'
// import createLogger from '../../../src/plugins/logger'

import * as types from './mutation-types'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// export default new Vuex.Store({
//   actions,
//   getters,
//   modules: {
//     search,
//     programs,
//     locations
//   },
//   strict: debug,
//   plugins: debug ? [createLogger()] : []
// })

export default new Vuex.Store({
  state: {

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
    },

    programs: {
      loading: false,
      error: null,
      success: false,
      entities: []
    },

    facilities: {
      loading: false,
      error: null,
      success: false,
      entities: []
    }
  },

  getters: {},

  actions: {

    searchFacilities ({commit}, serachParams) {
      commit(types.SUBMIT_SEARCH)
      commit(types.FETCH_FACILITIES)

      api(serachParams)
        .then(searchResults => {
          commit(types.RECEIVE_SEARCH_SUCCESS)
          commit(types.FETCH_FACILITIES_SUCCESS, searchResults)
        })
        .catch((err) => {
          console.error(err)
          commit(types.RECEIVE_SEARCH_SUCCESS)
        })
    }
  },

  mutations: {
    [types.SUBMIT_SEARCH] (state) {
      state.search.loading = true
      state.search.success = false
    },

    [types.RECEIVE_SEARCH_SUCCESS] (state, searchResults) {
      state.search.loading = false
      state.search.success = true
    },

    [types.FETCH_FACILITIES] (state) {
      state.facilities.loading = true
    },

    [types.FETCH_FACILITIES_SUCCESS] (state, rawResutlsSet) {
      state.facilities.loading = false
      state.facilities.entities = rawResutlsSet.data.rows
    }
  }
})
