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

    search ({commit}, serachParams) {
      commit(types.SUBMIT_SEARCH)

      api(serachParams)
        .then(searchResults => {
          commit(types.RECEIVE_SEARCH_SUCCESS, searchResults)
        })
        .catch((err) => {
          commit(types.RECEIVE_SEARCH_FAILURE, err)
        })
    }
  },

  mutations: {
    [types.SUBMIT_SEARCH] (state) {
      state.search.loading = true
      state.search.success = false
    },

    [types.RECEIVE_SEARCH_SUCCESS] (state, rawResutlsSet) {
      state.search.loading = false
      state.search.success = true
      state.facilities.entities = rawResutlsSet[0].data.rows
      state.programs.entities = rawResutlsSet[1].data.rows
    },

    [types.RECEIVE_SEARCH_FAILURE] (state, err) {
      state.search.loading = false
      state.search.success = false
      state.search.error = err
    }
  }
})
