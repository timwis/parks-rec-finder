import Vue from 'vue'
import Vuex from 'vuex'

import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    pendingRequests: {},
    activityCategories: [],
    locationCategories: [],
    locationCategoryDetails: {},
    locations: [],
    activityCategoryDetails: {},
    activities: [],
    locationDetails: {},
    activityDetails: {},
    searchLocationGeometry: null
  },
  mutations,
  actions
})

export default store
