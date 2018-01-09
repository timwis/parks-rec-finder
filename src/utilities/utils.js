/**
   * Makes sure that coordinates passed to SQL queries are strings
   * @param  {any} coordinates - any coordinates input value
   * @return {string}             comma separated latitiude and longitude values
   *
   * @since 0.1.0
   */
export function stringifyCoordinates (coordinates = null) {
  if (coordinates === null || (typeof coordinates === 'string' && coordinates.includes(','))) {
    return coordinates
  } else if (Array.isArray(coordinates) && (coordinates.length === 2)) {
    return coordinates.join(',')
  } else if (typeof coordinates === 'object' && (coordinates.hasOwnProperty('latitude') && coordinates.hasOwnProperty('longitude'))) {
    return `${coordinates.latitude},${coordinates.longitude}`
  }
}

/**
 * regex test a for zipcode structure
 * @param  {number}  zipcodeVal zipcode to validate
 * @return {boolean}            true if is valid; false if not
 *
 * @since 0.1.0
 */
export function isValidZipcode (zipcodeVal) {
  return (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcodeVal))
}

export function deSlugify (slug) {
  return slug
          // .replace('-and-', '-&-')
          .split('-')
          // .map(slugPart => slugPart.charAt(0).toLowerCase() + slugPart.slice(1))
          .join(' ')
          .replace('And', 'and')
}
