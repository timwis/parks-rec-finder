import api from '@/sources/api'
import * as types from './mutation-types'
import PPRFMarker from '@/store/modules/markers/Marker'

const actions = {

  setActiveTab ({commit, state}, entityType) {
    let type = entityType.toLowerCase().replace('s', '')
    if (type === 'location') { type = 'facility' }
    commit(types.SET_ACTIVE_TAB, type)
    commit(types.UPDATE_MARKERS, { entityType: type })
    // if (state.entities.hasOwnProperty(type)) {
    // } else {
    //   console.error(`entity type "${type}"" not found in state.entities properties`)
    // }
  },

  resetMarkers ({commit}) {
    commit(types.RESET_MARKERS)
  },

  updateMarkers ({commit}, entityType) {
    commit(types.UPDATE_MARKERS, entityType)
  },

  updateSearchInput ({commit, state}, serachParams) {
    commit(types.UPDATE_SEARCH_INPUT, serachParams)
  },

  updateEntities ({commit}, entityTypeObj) {
    commit(types.UPDATE_ENTITIES, {entities: {[entityTypeObj.type]: entityTypeObj.data.rows}})
  },

  updateEntitiesFromTaxonomy ({commit}, entityTypeObj) {
    /* eslint-disable no-unused-vars */
    let marker = {[entityTypeObj.type]: entityTypeObj.data.rows.map(entity => new PPRFMarker(entityTypeObj.type, entity))}
    commit(types.UPDATE_ENTITIES, {entities: {marker, [entityTypeObj.type]: entityTypeObj.data.rows}})
    commit(types.UPDATE_MARKERS, { entityType: entityTypeObj.type })
  },

  getTerms ({commit, state}, entityType) {
    debugger
    api.getTerms(entityType).then(results => {
      // console.log(results.data.rows)
      commit(types.UPDATE_ENTITIES, {entities: {activity_type: results.data.rows}})
    })
  },

  submitSearch ({commit, state}, serachParams) {
    let searchTerms = Object.assign({}, {fields: state.search.fields}, {filters: state.search.filters}, serachParams)
    commit(types.SUBMIT_SEARCH, searchTerms)

    api.search(searchTerms)
      .then(searchResults => {
        commit(types.RECEIVE_SEARCH_SUCCESS, searchResults)
        let facility = searchResults[0].data.rows
        let program = searchResults[1].data.rows
        let marker = {
          facility: searchResults[0].data.rows.map(entity => new PPRFMarker('facility', entity)),
          program: searchResults[1].data.rows.map(entity => new PPRFMarker('program', entity))
        }

        let flatResults = {
          facility,
          program,
          marker
        }

        commit(types.UPDATE_ENTITIES, { entities: flatResults })
        commit(types.UPDATE_MARKERS, { entityType: state.activeTab })
      })
      .catch((err) => {
        console.log(err)
        commit(types.RECEIVE_SEARCH_FAILURE, err)
      })
  }
}

export default actions
