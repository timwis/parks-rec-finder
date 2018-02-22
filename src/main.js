import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#application',
  render: h => h(App)
})
