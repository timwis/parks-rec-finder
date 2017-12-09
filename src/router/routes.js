import pprfLeafletMap from '@/components/map/pprf-leaflet-map'
// import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'

import pprfSidebarCategoriesContainer from '@/containers/pprf-sidebar-categories-container'
import pprfSidebaCategoryEntitiesContainer from '@/containers/pprf-sidebar-category-entities-container'

import pprfSidebarProgramDetailContainer from '@/containers/pprf-sidebar-program-detail-container'

const routes = [
  {
    path: '/', redirect: '/programs'
  },
  {
    path: '/search',
    name: 'Search',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarSearchContainer
    }
  },
  {
    path: '/program/:program_id',
    name: 'Program Detail',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarProgramDetailContainer
    },
    props: { default: true, sidebar: true }
  },

  // {
  //   path: '/location/:facility_id',
  //   name: 'Location Detail',
  //   components: {
  //     'map': pprfLeafletMap,
  //     'sidebar': pprfSidebarProgramDetailContainer
  //   },
  //   props: { default: true, sidebar: true }
  // },

  {
    path: '/:entityType/:entityTerm+',
    name: 'Taxonxomy Term Entities',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebaCategoryEntitiesContainer
    },
    props: { default: true, sidebar: true }
  },
  {
    path: '/:entityType',
    name: 'Taxonomy Terms',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarCategoriesContainer
    },
    props: { default: true, sidebar: true }
  }
]
export default routes
