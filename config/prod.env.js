'use strict'
module.exports = {
NODE_ENV: '"development"',
  CARTO_API: {
    BASE: '"https://phl.carto.com/api/v2/"',
    CACHE_QUERIES: true
  },
  AIS_API:{
    BASE: '"https://api.phila.gov/ais/v1/"',
    KEY: '"aeec9db5c3d2033149545595dd31c4bf"'
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
    CACHE_QUERIES: true
  }
}
