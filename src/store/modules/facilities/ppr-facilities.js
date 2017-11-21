import * as types from '../../mutation-types'

const state = {
  loading: false,
  error: null,
  success: false,
  entities: [],
  markers: []
}

const getters = {}

const actions = {}

const mutations = {
  [types.UPDATE_FACILITIES] (state, facilitiesIDs) {
    state.entities = facilitiesIDs
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
