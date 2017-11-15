'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  CARTO_API: {
    BASE: '"https://phl.carto.com/api/v2/"'
  },
  AIS_API:{
    BASE: '"https://api.phila.gov/ais/v1/"',
    KEY: '"6ba4de64d6ca99aa4db3b9194e37adbf"'
  }
})
