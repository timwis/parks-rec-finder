import Vue from 'vue'
import Router from 'vue-router'

import pprfHeader from '@/components/pprf-header'
import pprfMap from '@/components/map/pprf-map'
import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        'header': pprfHeader,
        'map': pprfMap,
        'sidebar': pprfSidebar
      }
    },

    {
      path: '/search',
      name: 'Search',
      components: {
        'header': pprfHeader,
        'map': pprfMap,
        'sidebar': pprfSidebarSearchContainer
      }
    }

    // {
    //   path: '/programs',
    //   name: 'Programs',
    //   components: {
    //     'map': pprfSidebar,
    //     'sidebar': pprfFMap
    //   }
    // },

    // {
    //   path: '/locations',
    //   name: 'Locations',
    //   components: {
    //     'map': pprfSidebar,
    //     'sidebar': pprfFMap
    //   }
    // }
  ]
})
