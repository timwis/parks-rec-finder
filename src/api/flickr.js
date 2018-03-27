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

  getPhotoUrl (photoId) {
    const params = {
      method: 'flickr.photos.getSizes',
      photo_id: photoId
    }
    return this.client({ params })
      .then((res) => res.data.sizes.size[5].source)
  }
}
