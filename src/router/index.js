import Vue from 'vue'
import Router from 'vue-router'
// import PPRFinder from '@/pprf-app'
import PPRFSearchContainer from '@/containers/pprf-search-container'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: PPRFSearchContainer
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
