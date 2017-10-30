import Vue from 'vue'
import Router from 'vue-router'
import pprfFMap from '@/components/map/pprf-map'
import pprfSidebar from '@/components/pprf-sidebar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      components: {
        'map': pprfSidebar,
        'sidebar': pprfFMap
      }
    }
  ]
})
