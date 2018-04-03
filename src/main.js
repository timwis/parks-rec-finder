import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'

import App from './App'
import store from './store'
import router from './router'

sync(store, router)
Vue.use(Meta)
Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#application',
  store,
  router,
  render: h => h(App)
})
