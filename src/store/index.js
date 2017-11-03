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
      state.facilities.loading = true
        api
          .search(serachParams)
          .then( searchResults => {
            commit(types.RECEIVE_SEARCH_SUCCESS)
            state.facilities.entities = searchResults.data.rows
          })
          .catch((err) => {
            console.error(err)
            commit(types.RECEIVE_SEARCH_SUCCESS)
          })
    },

    getPrograms ({commit}) {
      commit(types.FETCH_PROGRAMS)
      api.get('sql?q=select%20*%20from%20ppr_programs%20limit%20100').then((res) => {
        commit(types.FETCH_PROGRAMS_SUCCESS, res)
      })
    }

  },

  mutations: {

    [types.FETCH_PROGRAMS] (state) {
      state.programs.loading = true
    },

    [types.FETCH_PROGRAMS_SUCCESS] (state, rawResutlsSet) {
      state.programs.loading = false
      state.programs.entities = rawResutlsSet.data.rows
    }
  }
})
