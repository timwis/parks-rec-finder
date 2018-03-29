import axios from 'axios'

export default class AIS {
  constructor (baseURL, apiKey) {
    this.client = axios.create({
      baseURL,
      params: {
        gatekeeperKey: apiKey
      }
    })
  }

  async getAddressGeometry (address) {
    const path = `/search/${address}`
    const opts = { validateStatus: (status) => status < 500 } // don't reject 404s
    const response = await this.client.get(path, opts)

    if (response.status === 404) throw new Error('Address not found')
    else if (response.status !== 200) throw new Error('Address search failed')

    const feature = response.data.features[0]
    return feature.geometry.coordinates.slice().reverse() // [lat, lng]
  }
}
