'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CARTO_API: {
    BASE: '"https://phl.carto.com/api/v2/"',
    CACHE_QUERIES: false
  },
  AIS_API:{
    BASE: '"https://api.phila.gov/ais/v1/"',
    KEY: '"6ba4de64d6ca99aa4db3b9194e37adbf"'
  },
  ESRI: {
    tiledLayers: {
        basemap: '"https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer"',
        streets: '"https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer"'
    }
  },
  FLICKR_API: {
    KEY: '"d725fbb674d097510cba546d70aa0244"',
    BASE:  '"https://api.flickr.com/services/rest"',
    CACHE_QUERIES: false
  }
})
