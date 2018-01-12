import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import api from '@/sources/api'
import { routerHistory, writeHistory } from 'vue-router-back-button'
import LocalCacheManager from '@/sources/LocalCacheManager'
Vue.use(Router)
Vue.use(routerHistory)

let router = new Router({ routes })
// beforeEach also call in pprf-app
// to hook to progress bar
router.beforeEach((to, from, next) => {
  store.dispatch('dataLoading')
  store.dispatch('resetMarkers')
  store.dispatch('setMobileView', 'list')
  store.dispatch('closeModals')

  if (!LocalCacheManager.getRow('daysTable')) {
    api.getDays().then(results => {
      LocalCacheManager.store('daysTable', results.data.rows)
      // window.sessionStorage.setItem('ppr-days-table', JSON.stringify(results.data.rows))
    })
  }
  next()
})

router.afterEach((to, from) => {
  store.dispatch('dataLoaded')
})

router.afterEach(writeHistory)

export default router
