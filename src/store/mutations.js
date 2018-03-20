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
