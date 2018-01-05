import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/initial-state'
import PPRFMarker from '@/store/modules/markers/Marker'

import actions from './actions'
import mutations from './mutations'
// import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  mutations,

  getters: {
    getMarkersFor: (state) => (entityType) => {
      if (entityType === 'program' || entityType === 'facility') {
        return state.entities[entityType].map(entity => new PPRFMarker(entityType, entity))
      } else {
        return []
      }
    }
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
