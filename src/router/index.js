import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import api from '@/sources/api'
import { routerHistory, writeHistory } from 'vue-router-back-button'
Vue.use(Router)
Vue.use(routerHistory)

let router = new Router({ routes })

router.beforeEach((to, from, next) => {
  store.dispatch('resetMarkers')
  let PPRdaysTable = JSON.parse(window.localStorage.getItem('ppr-days-table'))

  if (!PPRdaysTable) {
    api.getDays().then(results => {
      window.localStorage.setItem('ppr-days-table', JSON.stringify(results.data.rows))
    })
  }

  next()
})

router.afterEach(writeHistory)

export default router
