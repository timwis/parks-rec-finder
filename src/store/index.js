import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'
// import * as getters from './getters'
import facilities from './modules/facilities/ppr-facilities'
import programs from './modules/programs/ppr-programs'
import search from './modules/search/ppr-search'
import * as types from './mutation-types'
import createLogger from 'vuex/dist/logger'

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
  actions: {
    setActiveTab ({commit, state}, entityType) {
      let type = entityType.toLowerCase()
      if (type === 'locations') { type = 'facilities' }
      commit(types.SET_ACTIVE_TAB, type)
      // if (state.entities.hasOwnProperty(type)) {
      // } else {
      //   console.error(`entity type "${type}"" not found in state.entities properties`)
      // }
    }
  },

  modules: {
    search,
    facilities,
    programs
  },

  state: {
    entities: {
      program: {},
      facility: {},
      activity_type: {},
      marker: {}
    },
    activeTab: 'programs'
  },

  getters: {
    facilityList: (state) => state.facilities.entities.map(facilityID => state.entities.facility[facilityID]),
    facilityListCount: (state, getters) => getters.facilityList.length,

    programList: (state) => state.programs.entities.map(programID => state.entities.program[programID]),
    programListCount: (state, getters) => getters.programList.length,

    markers: (state) => state[state.activeTab].entities.map(entityID => state.entities.marker[entityID])
  },

  mutations: {
    [types.SET_ACTIVE_TAB] (state, entityType) {
      state.activeTab = entityType
    },
    [types.UPDATE_ENTITIES] (state, { entities }) {
      // Loop over all kinds of entities we received
      for (let type in entities) {
        for (let entity in entities[type]) {
          const oldObj = state.entities[type][entity] || {}
          // Merge the new data in the old object
          const newObj = Object.assign(oldObj, entities[type][entity])
          state.entities[type][entity] = newObj
          // Make sure new entities are also reactive
          // Vue.set(state.entities[type], entity, newObj)
        }
      }
    }
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
