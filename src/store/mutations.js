export function SET_ACTIVITY_CATEGORIES (state, activityCategories) {
  state.activityCategories = activityCategories
}

export function SET_LOCATION_CATEGORIES (state, locationCategories) {
  state.locationCategories = locationCategories
}

export function SET_LOCATION_CATEGORY_DETAILS (state, locationCategoryDetails) {
  state.locationCategoryDetails = locationCategoryDetails
}

export function SET_LOCATIONS (state, locations) {
  state.locations = locations
}

export function RESET_LOCATION_CATEGORY_DETAILS (state) {
  state.locationCategoryDetails = {}
}

export function RESET_LOCATIONS (state) {
  state.locations = []
}

export function SET_ACTIVITY_CATEGORY_DETAILS (state, activityCategoryDetails) {
  state.activityCategoryDetails = activityCategoryDetails
}

export function SET_ACTIVITIES (state, activities) {
  state.activities = activities
}

export function RESET_ACTIVITY_CATEGORY_DETAILS (state) {
  state.activityCategoryDetails = {}
}

export function RESET_ACTIVITIES (state) {
  state.activities = []
}

export function SET_LOCATION (state, location) {
  state.location = location
}

export function RESET_LOCATION (state) {
  state.location = {}
}

export function SET_ACTIVITY (state, activity) {
  state.activity = activity
}

export function RESET_ACTIVITY (state) {
  state.activity = {}
}

export function SET_SEARCH_LOCATION_GEOMETRY (state, geometry) {
  state.searchLocationGeometry = geometry
}

export function RESET_SEARCH_LOCATION_GEOMETRY (state) {
  state.searchLocationGeometry = null
}
