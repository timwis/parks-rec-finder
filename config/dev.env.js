'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PPR_API: {
    BASE: '"https://phl.carto.com/api/v2/"',
    FACILITIES: '"sql=q?select%20*%20from%20ppr_programs%20limit%20100"',
    PROGRAMS: '"sql?q=select%20*%20from%20ppr_programs%20limit%20100"'
  }
})
