import pprfLeafletMap from '@/components/map/pprf-leaflet-map'
// import pprfSidebar from '@/components/pprf-sidebar'
import pprfSidebarSearchContainer from '@/containers/pprf-sidebar-search-container'
import pprfSidebarEntityTaxoTermsContainer from '@/containers/pprf-sidebar-entity-taxo-terms-container'
import pprfSidebarEntityTaxoContainer from '@/containers/pprf-sidebar-entity-taxo-container'
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
  {
    path: '/:entityType/:entityTerm+',
    name: 'Taxonxomy Term Items',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarEntityTaxoContainer
    },
    props: { default: true, sidebar: true }
  },
  {
    path: '/:entityType',
    name: 'Taxonomy Terms',
    components: {
      'map': pprfLeafletMap,
      'sidebar': pprfSidebarEntityTaxoTermsContainer
    },
    props: { default: true, sidebar: true }
  }
]
export default routes
