// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import { sync } from 'vuex-router-sync'
import store from './store'
import PPRFinder from './pprf-app'
import router from './router'
import VueProgressBar from 'vue-progressbar'
import fontawesome from '@fortawesome/fontawesome'
import { faSearch, faPlus, faMinus, faTimes } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(faSearch, faPlus, faMinus, faTimes)

sync(store, router)
Vue.use(Vuex)
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

Vue.config.productionTip = process.env.NODE_ENV === 'production'

/* eslint-disable no-new */
new Vue({
  el: '#PPR-Finder',
  template: '<PPRFinder/>',
  components: { PPRFinder },
  router,
  store
})
