import Vue from 'vue'
import VueRouter from 'vue-router'

import Categories from '~/pages/Categories'
import ActivityList from '~/pages/ActivityList'
import LocationList from '~/pages/LocationList'
import ActivityDetail from '~/pages/ActivityDetail'
import LocationDetail from '~/pages/LocationDetail'
import SearchResults from '~/pages/SearchResults'

Vue.use(VueRouter)

const routes = [
  {
    path: '/activities',
    alias: '/',
    name: 'activityCategories',
    component: Categories,
    props: { activeTab: 'activities' },
    meta: { mapShows: null}
  },
  {
    path: '/locations',
    name: 'locationCategories',
    component: Categories,
    props: { activeTab: 'locations' },
    meta: { mapShows: null }
  },
  {
    path: '/activities/:categorySlug',
    name: 'activityList',
    component: ActivityList,
    props: true,
    meta: { mapShows: 'activities' }
  },
  {
    path: '/locations/:categorySlug',
    name: 'locationList',
    component: LocationList,
    props: true,
    meta: { mapShows: 'locations' }
  },
  {
    path: '/activity/:id',
    alias: '/program/:id',
    name: 'activityDetail',
    component: ActivityDetail,
    props: true,
    meta: { mapShows: 'activity' }
  },
  {
    path: '/location/:id',
    name: 'locationDetail',
    component: LocationDetail,
    props: true,
    meta: { mapShows: 'location' }
  },
  {
    path: '/search/activities',
    alias: '/search',
    name: 'activitiesSearchResults',
    component: SearchResults,
    props: (route) => ({
      activeTab: 'activities',
      ...route.query
    }),
    meta: { mapShows: 'activities' }
  },
  {
    path: '/search/locations',
    alias: '/search',
    name: 'locationsSearchResults',
    component: SearchResults,
    props: (route) => ({
      activeTab: 'locations',
      ...route.query
    }),
    meta: { mapShows: 'locations' }
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
