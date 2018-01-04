import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import { routerHistory, writeHistory } from 'vue-router-back-button'
Vue.use(Router)
Vue.use(routerHistory)

let router = new Router({ routes })

router.beforeEach((to, from, next) => {
  store.dispatch('dataLoading')
  store.dispatch('resetMarkers')
  next()
})

router.afterEach((to, from) => {
  store.dispatch('dataLoaded')
})

router.afterEach(writeHistory)

export default router
