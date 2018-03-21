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
    component: ActivityDetail,
    props: true
  },
  {
    path: '/location/:id',
    name: 'locationDetail',
    component: LocationDetail,
    props: true
  },
  {
    path: '/search/:activeTab',
    alias: '/search',
    name: 'searchResults',
    component: SearchResults,
    props: (route) => ({
      ...route.query,
      ...route.params
    })
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
