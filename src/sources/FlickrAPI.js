import axios from 'axios'

class FlickrAPI {
  constructor (HTTPClient) {
    this.http = HTTPClient.create({baseURL: process.env.FLICKR_API.BASE})
    this._addAuthParam()
  }

  _addAuthParam () {
    this.http.interceptors.request.use(function (config) {
      config.params.api_key = process.env.FLICKR_API.KEY
      config.params.format = 'json'
      config.params.nojsoncallback = 1
      return config
    })
  }

  getSizes (photoID) {
    return this.http.get('?method=flickr.photos.getSizes', { params: {photo_id: photoID} })
  }
}

export let flickrAPI = new FlickrAPI(axios)
