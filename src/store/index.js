import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'
// import * as getters from './getters'
import facilities from './modules/facilities/ppr-facilities'
import programs from './modules/programs/ppr-programs'
import search from './modules/search/ppr-search'
import * as types from './mutation-types'
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
  state: {
    entities: {
      program: {},
      facility: {},
      activity_type: {}
    }
  },

  getters: {
    facilityList: (state) => state.facilities.entities.map(facilityID => state.entities.facility[facilityID]),
    facilityListCount: (state, getters) => getters.facilityList.length,

    programList: (state) => state.programs.entities.map(programID => state.entities.program[programID]),
    programListCount: (state, getters) => getters.programList.length
  },

  actions: {},

  mutations: {
    [types.UPDATE_ENTITIES] (state, { entities }) {
      // Loop over all kinds of entities we received
      for (let type in entities) {
        for (let entity in entities[type]) {
          const oldObj = state.entities[type][entity] || {}
          // Merge the new data in the old object
          const newObj = Object.assign(oldObj, entities[type][entity])
          // Make sure new entities are also reactive
          Vue.set(state.entities[type], entity, newObj)
        }
      }
    }
  },

  strict: debug
})
