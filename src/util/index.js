import pickBy from 'lodash/pickBy'
import sortBy from 'lodash/sortBy'
import dateFnsFormat from 'date-fns/format'

export function concatAddress (addressParts = {}) {
  const { street, street2, city, state, zip } = addressParts
  const order = [ street, street2, city, state, zip ]
  return order
    .filter((part) => part && part.length > 0)
    .join(', ')
}

export function getAgeRange (low, high) {
  return [low, high].join('-')
}

export function getFeeDescription (fee, frequency) {
  if (fee === '' || fee === '0.00') {
    return 'Free'
  } else {
    return [
      '$' + fee,
      frequency.toLowerCase()
    ].join(' ')
  }
}

export function removeEmptyKeys (obj) {
  return pickBy(obj, (value) => !!value && value.length > 0)
}

export function formatPhone (input) {
  if (typeof input !== 'string' || input.length !== 10) return input

  const areaCode = input.substr(0, 3)
  const prefix = input.substr(3, 3)
  const lineNumber = input.substr(6)
  return `(${areaCode}) ${prefix}-${lineNumber}`
}

export function formatDate (input) {
  return dateFnsFormat(input, 'MMM. D, YYYY')
}

export function formatTime (input) {
  // format function requires parseable date, but we're
  // only dealing with the time, so any date will work.
  const datetime = '2018-01-01T' + input
  return dateFnsFormat(datetime, 'h:mm aa')
}

export function formatDaysList (days) {
  const pluralDays = days.map((day) => day + 's')
  if (pluralDays.length > 1) {
    const last = pluralDays.length - 1
    pluralDays[last] = 'and ' + pluralDays[last]
  }
  return pluralDays.join(', ')
}

const daysSortKeys = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6
}

export function sortByFirstDay (schedules) {
  return sortBy(schedules, (schedule) => daysSortKeys[schedule.days[0]])
}
