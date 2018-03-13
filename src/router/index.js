import Vue from 'vue'
import VueRouter from 'vue-router'

import ActivityCategories from '~/pages/ActivityCategories'

Vue.use(VueRouter)

const routes = [
  {
    path: '/activities',
    alias: '/',
    name: 'activityCategories',
    component: ActivityCategories
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
