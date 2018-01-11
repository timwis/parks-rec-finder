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
  store.dispatch('dataLoading')
  store.dispatch('resetMarkers')
  store.dispatch('setMobileView', 'list')
  store.dispatch('closeModals')

  let PPRdaysTable = JSON.parse(window.localStorage.getItem('ppr-days-table'))
  if (!PPRdaysTable) {
    api.getDays().then(results => {
      window.localStorage.setItem('ppr-days-table', JSON.stringify(results.data.rows))
    })
  }
  next()
})

router.afterEach((to, from) => {
  store.dispatch('dataLoaded')
})

router.afterEach(writeHistory)

export default router
