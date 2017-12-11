import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
Vue.use(Router)

let router = new Router({ routes })

router.beforeEach((to, from, next) => {
  store.dispatch('resetMarkers')
  next()
})

export default router
