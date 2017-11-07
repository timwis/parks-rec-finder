import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'
// import * as getters from './getters'
import facilities from './modules/facilities/ppr-facilities'
import programs from './modules/programs/ppr-programs'
import search from './modules/search/ppr-search'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

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
  modules: {
    search,
    facilities,
    programs
  },
  state: {},

  getters: {},

  actions: {},

  mutations: {},

  strict: debug
})
