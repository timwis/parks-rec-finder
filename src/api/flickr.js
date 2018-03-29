import axios from 'axios'

export default class Flickr {
  constructor (baseURL, apiKey) {
    this.client = axios.create({
      baseURL,
      params: {
        api_key: apiKey,
        format: 'json',
        nojsoncallback: 1
      }
    })
  }

  async getPhotoUrl (photoId) {
    const params = {
      method: 'flickr.photos.getSizes',
      photo_id: photoId
    }
    const response = await this.client({ params })
    if (response.data.stat !== 'ok') throw new Error('Photo lookup failed')
    return response.data.sizes.size[5].source
  }
}
