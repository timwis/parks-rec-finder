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
    component: Categories,
    props: { activeTab: 'activities' }
  },
  {
    path: '/locations',
    component: Categories,
    props: { activeTab: 'locations' }
  },
  {
    path: '/activities/:categorySlug',
    component: Activities
  },
  {
    path: '/locations/:categorySlug',
    component: Locations
  },
  {
    path: '/activity/:activitySlug/:id',
    component: ActivityDetails
  },
  {
    // Backwards compatibility with w/v1.0
    path: '/program/:id',
    component: ActivityDetails
  },
  {
    path: '/location/:locationSlug/:id',
    component: LocationDetails
  },
  {
    // Backwards compatibility with w/v1.0
    path: '/location/:id',
    component: LocationDetails
  },
  {
    path: '/search/activities',
    alias: '/search',
    component: SearchResults,
    props: { activeTab: 'activities' }
  },
  {
    path: '/search/locations',
    alias: '/search',
    component: SearchResults,
    props: { activeTab: 'locations' }
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
