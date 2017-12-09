import store from '@/store'

const updateStateFromCache = {
  beforeRouteEnter (to, from, next) {
    let cachedResults = []
    Object.keys(store.state.cache.entities)
      .forEach(entityType => {
        cachedResults = cachedResults.concat(store.state.cache.entities[entityType])
      })
    if (cachedResults.length > 0) {
      next(vm => {
        let entities = store.state.cache.entities
        store.dispatch('updateEntities', {entities})
        store.dispatch('updateMarkers', {entityType: 'program'})
        store.dispatch('updateSearchInput', {filters: store.state.cache.filters})
      })
    } else {
      next()
    }
  }
}

export default updateStateFromCache
