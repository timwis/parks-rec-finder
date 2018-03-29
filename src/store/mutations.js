export default {
  SET_ACTIVITY_CATEGORIES (state, activityCategories) {
    state.activityCategories = activityCategories
  },

  SET_LOCATION_CATEGORIES (state, locationCategories) {
    state.locationCategories = locationCategories
  },

  SET_ACTIVITY_CATEGORY_DETAILS (state, activityCategoryDetails) {
    state.activityCategoryDetails = activityCategoryDetails
  },

  RESET_ACTIVITY_CATEGORY_DETAILS (state) {
    state.activityCategoryDetails = {}
  },

  SET_LOCATION_CATEGORY_DETAILS (state, locationCategoryDetails) {
    state.locationCategoryDetails = locationCategoryDetails
  },

  RESET_LOCATION_CATEGORY_DETAILS (state) {
    state.locationCategoryDetails = {}
  },

  SET_ACTIVITIES (state, activities) {
    state.activities = activities
  },

  RESET_ACTIVITIES (state) {
    state.activities = []
  },

  SET_LOCATIONS (state, locations) {
    state.locations = locations
  },

  RESET_LOCATIONS (state) {
    state.locations = []
  },

  SET_ACTIVITY_DETAILS (state, activityDetails) {
    state.activityDetails = activityDetails
  },

  RESET_ACTIVITY_DETAILS (state) {
    state.activityDetails = {}
  },

  SET_LOCATION_DETAILS (state, locationDetails) {
    state.locationDetails = locationDetails
  },

  RESET_LOCATION_DETAILS (state) {
    state.locationDetails = {}
  },

  SET_SEARCH_LOCATION_GEOMETRY (state, geometry) {
    state.searchLocationGeometry = geometry
  },

  RESET_SEARCH_LOCATION_GEOMETRY (state) {
    state.searchLocationGeometry = null
  }
}
