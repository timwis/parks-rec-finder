import Vue from 'vue'
import Router from 'vue-router'
import PprfSidebar from '@/components/pprf-sidebar'
import PprfMap from '@/components/map/pprf-map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      components: {
        PprfMap,
        PprfSidebar
      }
    }
  ]
})
