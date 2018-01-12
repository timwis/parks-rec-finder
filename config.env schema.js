'use strict'
module.exports = {
NODE_ENV: '"development"',
  CARTO_API: {
    BASE: '"carto api endpoint"',
    CACHE_QUERIES: true
  },
  AIS_API:{
    BASE: '"ais api endpoint"',
    KEY: '"ais api key"'
  },
  ESRI: {
    tiledLayers: {
      basemap: '"city basemap argis tiles endpoint"',
      streets: '"city streets argis tiles endpoint"'
    }
  },
  FLICKR_API: {
    KEY: '"PPR flickr api key"',
    BASE:  '" flickr api base url"',
    CACHE_QUERIES: true
  }
}
