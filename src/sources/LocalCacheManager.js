import { sha256 } from 'js-sha256'
import moment from 'moment'

class LocalCacheManager {
  constructor (storage) {
    this.storage = storage
    this.prefix = 'pprf-'
  }

  _buildStorageKey (rawKey) {
    return `${this.prefix}${sha256(rawKey)}~${moment()}`
  }

  _getTimestamp (key) {
    if (key) {
      return key.replace(/^.+~/, '')
    } else {
      return false
    }
  }

  getRow (storageKey) {
    if (Object.keys(this.storage).length) {
      let rowsLookupTable = {}
      // populate lookup table
      Object.keys(this.storage).forEach(key => {
        rowsLookupTable[`${key.replace(this.prefix, '').replace(/(~.*)/g, '')}`] = key
      })
      let key = sha256(storageKey)
      //  @TODO: expire the cache using the timestamp and moment.js
      // let timeStamp = this._getTimestamp(rowsLookupTable[key])
      if (this.storage.getItem(rowsLookupTable[key])) {
        return JSON.parse(this.storage.getItem(rowsLookupTable[key]))
      } else {
        return false
      }
    }
  }

  store (storageKey, data) {
    let key = this._buildStorageKey(storageKey)
    this.storage.setItem(key, JSON.stringify(data))
  }

  clear () {
    this.storage.clear()
  }
}

export default new LocalCacheManager(window.sessionStorage)
