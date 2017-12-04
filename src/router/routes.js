import pprfLeafletMap from '@/components/map/pprf-leaflet-map'
// import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'
import pprfSidebarEntityTaxoContainer from '@/containers/pprf-sidebar-entity-taxo-container'

const routes = [
  {
    path: '/', redirect: '/categories/programs'
  },

  {
    path: '/categories/:entityType/:entityTerm?',
    name: 'Home',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarEntityTaxoContainer
    },
    props: { default: true, sidebar: true }
  },

  {
    path: '/search',
    name: 'Search',
    components: {
      'map': pprfLeafletMap,
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
