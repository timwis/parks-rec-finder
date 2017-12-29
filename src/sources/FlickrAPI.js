import axios from 'axios'
import _ from 'underscore'

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
    if (window.localStorage.getItem(`pprf-flickr-${photoID}-Medium`)) {
      return new Promise((resolve) => {
        let mediumImageBase64URL = window.localStorage.getItem(`pprf-flickr-${photoID}-Medium`)
        // @TODO: clean this mock data structure up
        let data = {
          data: {
            sizes: {
              size: {
                '5': {source: mediumImageBase64URL}
              }
            }
          }
        }
        resolve(data)
      })
    }

    return this.http.get('?method=flickr.photos.getSizes', { params: {photo_id: photoID} })
                    .then(results => {
                      // console.log(results)
                      this.cacheQuery(photoID, results)
                      return results
                    })
  }

  cacheQuery (photoID, data) {
    let store = window.localStorage
    if (store.getItem(photoID)) {
      alert(photoID)
    } else {
      if (data.data.stat !== 'fail' && _.findWhere(data.data.sizes.size, {label: 'Medium'})) {
        // @TODO: use better image size validation to get medium size image
        // instead of using just array index
        this.toDataUrl(data.data.sizes.size[5].source, base64Image => {
          store.setItem(`pprf-flickr-${photoID}-${data.data.sizes.size[5].label}`, base64Image)
        })
        // @TODO: figure our how to cache all image sizes witout going over memory limit
        // data.data.sizes.size = _.mapObject(data.data.sizes.size, (size) => {
        //   if (size.source) {
        //     this.toDataUrl(size.source, base64Image => {
        //       size.source = base64Image
        //       store.setItem(`pprf-flickr-${photoID}-${size.label}`, base64Image)
        //     })
        //   }
        //   return size
        // })
      }
    }
  }

  /**
   * @see https://stackoverflow.com/questions/22172604/convert-image-url-to-base64
   */
  toDataUrl (url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
      var reader = new FileReader()
      reader.onloadend = function () {
        callback(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  }
}

export let flickrAPI = new FlickrAPI(axios)
