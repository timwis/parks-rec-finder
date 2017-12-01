import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
// import * as getters from './getters'

import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    entities: {
      program: {},
      facility: {},
      activity_type: {},
      marker: {}
    },
    activeMarkers: [],
    activeTab: 'program',
    search: {
      loading: false,
      error: null,
      success: false,
      fields: {
        freetext: '',
        address: '',
        zip: 0
      },
      filters: {
        fee: null,
        gender: null,
        ageRange: {low: null, high: null}
      }
    }
  },

  actions,
  mutations,

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
