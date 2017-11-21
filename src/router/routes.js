import pprfMap from '@/components/map/pprf-map'
// import pprfLeafletMap from '@/components/map/pprf-leaflet-map'
import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      // 'map': pprfMap,
      'sidebar': pprfSidebar
    }
  },

  {
    path: '/search',
    name: 'Search',
    components: {
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
export default routes
