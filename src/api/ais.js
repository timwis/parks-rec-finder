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

  getAddressGeometry (address) {
    const path = `/search/${address}`
    return this.client.get(path)
      .then((res) => res.data.features[0].geometry.coordinates.slice().reverse())
  }
}
