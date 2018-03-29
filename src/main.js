import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#application',
  store,
  router,
  render: h => h(App)
})
