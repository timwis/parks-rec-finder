import Vue from 'vue'
import VueRouter from 'vue-router'

import Categories from '~/pages/Categories'
import Activities from '~/pages/Activities'
import Locations from '~/pages/Locations'
import ActivityDetails from '~/pages/ActivityDetails'
import LocationDetails from '~/pages/LocationDetails'
import SearchResults from '~/pages/SearchResults'

Vue.use(VueRouter)

const routes = [
  {
    path: '/activities',
    alias: '/',
    name: 'activityCategories',
    component: Categories,
    props: { activeTab: 'activities' }
  },
  {
    path: '/locations',
    name: 'locationCategories',
    component: Categories,
    props: { activeTab: 'locations' }
  },
  {
    path: '/activities/:categorySlug',
    name: 'activities',
    component: Activities
  },
  {
    path: '/locations/:categorySlug',
    name: 'locations',
    component: Locations
  },
  {
    path: '/activity/:id',
    alias: '/program/:id',
    name: 'activityDetail',
    component: ActivityDetails
  },
  {
    path: '/location/:id',
    name: 'locationDetail',
    component: LocationDetails
  },
  {
    path: '/search/activities',
    alias: '/search',
    name: 'activitiesSearchResults',
    component: SearchResults,
    props: { activeTab: 'activities' }
  },
  {
    path: '/search/locations',
    alias: '/search',
    name: 'locationsSearchResults',
    component: SearchResults,
    props: { activeTab: 'locations' }
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
