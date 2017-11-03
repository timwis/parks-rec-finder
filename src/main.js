// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import PPRFinder from './pprf-app'
import router from './router'

Vue.use(Vuex)

Vue.config.productionTip = process.env.NODE_ENV === 'production'

/* eslint-disable no-new */
new Vue({
  el: '#PPR-Finder',
  router,
  template: '<PPRFinder/>',
  components: { PPRFinder },
  store
})
