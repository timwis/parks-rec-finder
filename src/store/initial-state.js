const state = {
  entities: {
    program: [],
    facility: [],
    category: {
      program: [],
      facility: []
    },
    marker: {
      program: [],
      facility: []
    }
  },
  mapMarkers: [],
  activeTab: 'program',
  search: {
    loading: false,
    error: null,
    success: false,
    fields: {
      freetext: '',
      address: '',
      zip: 0
    },
    filters: {
      fee: null,
      gender: null,
      ageRange: {low: null, high: null}
    }
  }
}

export default state
