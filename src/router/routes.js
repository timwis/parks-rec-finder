import pprfLeafletMap from '@/components/map/pprf-leaflet-map'
// import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'

import pprfSidebarCategoriesContainer from '@/containers/pprf-sidebar-categories-container'
import pprfSidebaCategoryEntitiesContainer from '@/containers/pprf-sidebar-category-entities-container'

import pprfSidebarProgramDetailContainer from '@/containers/pprf-sidebar-program-detail-container'
import pprfSidebarLocationDetailContainer from '@/containers/pprf-sidebar-location-detail-container'

const routes = [
  {
    path: '/', redirect: '/activities'
  },
  {
    path: '/search',
    name: 'Search',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarSearchContainer
    },
    meta: {
      bodyClass: 'view--search'
    }
  },
  {
    path: '/program/:program_id',
    name: 'Program Detail',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarProgramDetailContainer
    },
    props: { default: true, sidebar: true },
    meta: {
      bodyClass: 'view--entity-detail'
    }
  },

  {
    path: '/location/:facility_id',
    name: 'Location Detail',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarLocationDetailContainer
    },
    props: { default: true, sidebar: true },
    meta: {
      bodyClass: 'view--entity-detail'
    }
  },

  {
    path: '/:entityType/:entityTerm+',
    name: 'Taxonxomy Term Entities',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebaCategoryEntitiesContainer
    },
    props: { default: true, sidebar: true },
    meta: {
      bodyClass: 'view--entity-list'
    }
  },
  {
    path: '/:entityType',
    name: 'Taxonomy Terms',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarCategoriesContainer
    },
    props: { default: true, sidebar: true },
    meta: {
      bodyClass: 'view--taxonomy-list'
    }
  }
]
export default routes
