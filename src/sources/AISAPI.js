import axios from 'axios'

/**
 * Abstraction layer for the City of Philadelphia's Address Information System (AIS) API
 * @docs https://github.com/CityOfPhiladelphia/ais/blob/master/docs/APIUSAGE.md#Addresses
 */
class AISAPI {
  constructor (httpClient) {
    this.http = httpClient.create({baseURL: process.env.AIS_API.BASE})
    this.API_KEY = process.env.AIS_API.KEY
    this._addKeyToGETRequests(this.API_KEY)
  }

  /**
   * Add the gatekeepKey validation key to all GET requests
   * @param {string} apiKey - AIS gatekeeper key
   * @return void
   *
   * @since 0.0.0
   */
  _addKeyToGETRequests (apiKey) {
    this.http.interceptors.request.use(function (config) {
      if (config.method === 'get') {
        config.url = `${config.url}?gatekeeperKey=${apiKey}`
      }
      return config
    }, function (error) {
      return Promise.reject(error)
    })
  }

  /**
   * Check to make sure location exist and has valid geometry data
   * @param  {object} locationData - location object returned from AIS query
   * @return {boolean}              ture if location has a feature of type 'POINT'
   *
   * @since 0.0.0
   */
  _locationExist (locationData) {
    //
    return (locationData.features.length > 0 && (locationData.features[0].geometry && locationData.features[0].geometry.type === 'Point'))
  }

  /**
   * Query the AIS API for an adddress and return
   * the coordinates of that address
   * @param  {string} rawAddressString - user input from address search field
   * @return {array}                  [latitude: string, longitude: string]
   *
   * @since 0.0.0
   */
  getCoordsForAddress (rawAddressString) {
    return this.http
            .get(`/search/${rawAddressString}`)
            .then((res) => {
              let data = res.data
              if (this._locationExist(data)) {
                return data.features[0].geometry.coordinates
              }
              return null
            })
  }
}

export let aisAPI = new AISAPI(axios)
