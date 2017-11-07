import * as types from '../../mutation-types'
import api from '@/sources/api'

const state = {
  loading: false,
  error: null,
  success: false,

  fields: {
    freetext: '',
    address: '',
    zip: 0
  },
  filters: {}
}

const getters = {}

const actions = {
  submitSearch ({state, commit}, serachParams) {
    commit(types.SUBMIT_SEARCH)
    api(serachParams)
        .then(searchResults => {
          commit(types.RECEIVE_SEARCH_SUCCESS, searchResults)
          commit(types.UPDATE_FACILITIES, searchResults[0], {root: true})
          commit(types.UPDATE_PROGRAMS, searchResults[1], {root: true})
        })
        .catch((err) => {
          commit(types.RECEIVE_SEARCH_FAILURE, err)
        })
  }
}

const mutations = {
  [types.SUBMIT_SEARCH] (state) {
    state.loading = true
    state.success = false
  },

  [types.RECEIVE_SEARCH_SUCCESS] (state, rawResutlsSets) {
    state.loading = false
    state.success = true
  },

  [types.RECEIVE_SEARCH_FAILURE] (state, err) {
    state.loading = false
    state.success = false
    state.error = err
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
