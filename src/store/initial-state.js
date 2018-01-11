const state = {
  loading: true,

  mobile: {
    searchOpen: false,
    listView: true,
    navOpen: false,
    filtersOpen: false
  },

  modals: {
    about: {
      open: false
    }
  },

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
    // fitlers must start as null
    filters: {
      fee: null,
      gender: null,
      ageRange: {low: null, high: null},
      days: null,
      startDate: null,
      endDate: null
    }
  }
}

export default state
