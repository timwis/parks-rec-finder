// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import { sync } from 'vuex-router-sync'
import store from './store'
import PPRFinder from './pprf-app'
import router from './router'
import VueProgressBar from 'vue-progressbar'
import fontawesome from '@fortawesome/fontawesome'
import * as freeSolid from '@fortawesome/fontawesome-free-solid'
import VueScrollTo from 'vue-scrollto'

fontawesome.library.add(freeSolid)

sync(store, router)
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueScrollTo)
Vue.use(VueProgressBar, {
  color: 'rgb(37, 206, 247)',
  failedColor: 'red',
  thickness: '5px'
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
