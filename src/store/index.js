import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    route: {}, // only set by vuex-router-sync
    activityCategories: [],
    locationCategories: [],
    activityCategoryDetails: {},
    locationCategoryDetails: {},
    activities: [],
    locations: [],
    activityDetails: {},
    locationDetails: {},
    searchLocationGeometry: null
  },
  mutations,
  actions,
  getters
})

export default store
