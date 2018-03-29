import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
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
  actions
})

export default store
