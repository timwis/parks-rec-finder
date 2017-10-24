// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import PPRFinder from './pprf-app'
import router from './router'

Vue.config.productionTip = false
Vue.config.NAMESPACE = process.env.NAMESPACE

/* eslint-disable no-new */
new Vue({
  el: '#PPR-Finder',
  router,
  template: '<PPRFinder/>',
  components: { PPRFinder }
})
