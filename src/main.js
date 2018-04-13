import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
import VueGtm from 'vue-gtm'

import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false
sync(store, router)
Vue.use(Meta)
Vue.use(VueGtm, {
  debug: (process.env.NODE_ENV !== 'production'),
  vueRouter: router
})

new Vue({ // eslint-disable-line no-new
  el: '#application',
  store,
  router,
  render: h => h(App)
})
