import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'

import App from './App'
import store from './store'
import router from './router'

Vue.use(VueProgressBar, {
  color: 'rgb(37, 206, 247)',
  failedColor: 'red',
  thickness: '5px'
})

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#application',
  store,
  router,
  render: h => h(App)
})
