import pick from 'lodash/pick'
const filterKeys = ['cost', 'age', 'gender', 'days']

export default {
  currentFilters (state) {
    const filters = pick(state.route.query, filterKeys)

    // If only one day is selected, the filter is parsed as
    // a string. It should always be an array.
    if (typeof filters.days === 'string') {
      filters.days = [ filters.days ]
    }

    return filters
  },

  filteredActivities (state, getters) {
    const activities = state.activities
    const currentFilters = getters.currentFilters
    const filterFunctions = []

    if (currentFilters.cost) {
      filterFunctions.push((activity) => {
        return activity.fee === '' || activity.fee === '0.00'
      })
    }

    if (currentFilters.age) {
      const [filterLow, filterHigh] = currentFilters.age.split('-')
      filterFunctions.push((activity) => {
        return (!filterHigh || activity.ageLow <= filterHigh) &&
          (!filterLow || activity.ageHigh >= filterLow)
      })
    }

    if (currentFilters.gender) {
      const genderInitial = getGenderInitial(currentFilters.gender)
      filterFunctions.push((activity) => {
        return activity.gender === genderInitial || activity.gender === 'M/F'
      })
    }

    if (currentFilters.days && currentFilters.days.length > 0) {
      filterFunctions.push((activity) => {
        return currentFilters.days.some((day) => {
          return activity.schedules && activity.schedules.some((schedule) => {
            return schedule.days && schedule.days.includes(day)
          })
        })
      })
    }

    return activities.filter((activity) => {
      return filterFunctions.every((fn) => fn(activity))
    })
  }
}

const genderInitialsMap = { male: 'M', female: 'F' }
function getGenderInitial (gender) {
  return genderInitialsMap[gender]
}
