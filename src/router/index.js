import Vue from 'vue'
import VueRouter from 'vue-router'

import Categories from '~/pages/Categories'
import ActivityList from '~/pages/ActivityList'
import LocationList from '~/pages/LocationList'

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
    path: '/activities/:category',
    name: 'activityList',
    component: ActivityList,
    props: true
  },
  {
    path: '/locations/:category',
    name: 'locationList',
    component: LocationList,
    props: true
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
