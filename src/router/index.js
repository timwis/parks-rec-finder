import Vue from 'vue'
import VueRouter from 'vue-router'

import Categories from '~/pages/Categories'
import ActivityList from '~/pages/ActivityList'
import LocationList from '~/pages/LocationList'
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
    name: 'activityList',
    component: ActivityList,
    props: true
  },
  {
    path: '/locations/:categorySlug',
    name: 'locationList',
    component: LocationList,
    props: true
  },
  {
    path: '/activity/:id',
    alias: '/program/:id',
    name: 'activityDetail',
    component: ActivityDetails,
    props: true
  },
  {
    path: '/location/:id',
    name: 'locationDetail',
    component: LocationDetails,
    props: true
  },
  {
    path: '/search/activities',
    alias: '/search',
    name: 'activitiesSearchResults',
    component: SearchResults,
    props: (route) => ({
      activeTab: 'activities',
      searchTerm: route.query.term,
      searchLocation: route.query.location
    })
  },
  {
    path: '/search/locations',
    alias: '/search',
    name: 'locationsSearchResults',
    component: SearchResults,
    props: (route) => ({
      activeTab: 'locations',
      searchTerm: route.query.term,
      searchLocation: route.query.location
    })
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
