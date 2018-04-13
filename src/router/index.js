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
    props: { activeTab: 'activities' },
    name: 'activityCategories'
  },
  {
    path: '/locations',
    component: Categories,
    props: { activeTab: 'locations' },
    name: 'locationCategories'
  },
  {
    path: '/activities/:categorySlug',
    component: Activities,
    name: 'activities'
  },
  {
    path: '/locations/:categorySlug',
    component: Locations,
    name: 'locations'
  },
  {
    path: '/activity/:activitySlug/:id',
    component: ActivityDetails,
    name: 'activityDetails'
  },
  {
    // Backwards compatibility with w/v1.0
    path: '/program/:id',
    component: ActivityDetails,
    name: 'activityDetailsV2'
  },
  {
    path: '/location/:locationSlug/:id',
    component: LocationDetails,
    name: 'locationDetails'
  },
  {
    // Backwards compatibility with w/v1.0
    path: '/location/:id',
    component: LocationDetails,
    name: 'locationDetailsV1'
  },
  {
    path: '/search/activities',
    alias: '/search',
    component: SearchResults,
    props: { activeTab: 'activities' },
    name: 'searchResultsActivities'
  },
  {
    path: '/search/locations',
    alias: '/search',
    component: SearchResults,
    props: { activeTab: 'locations' },
    name: 'searchResultsLocations'
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
