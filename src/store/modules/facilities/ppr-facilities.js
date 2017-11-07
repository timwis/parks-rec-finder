import * as types from '../../mutation-types'

const state = {
  loading: false,
  error: null,
  success: false,
  entities: []
}

const getters = {}

const actions = {}

const mutations = {
  [types.UPDATE_FACILITIES] (state, rawResultsSet) {
    state.entities = rawResultsSet.data.rows
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
