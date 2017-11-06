import axios from 'axios'
/* eslint-disable no-unused-vars */
import squel from 'squel'
/* eslint-disable no-unused-vars */
import {cartoAPI} from './CartoAPI'

const AISAPI_KEY = process.env.AIS_API.KEY
const AISAPI = axios.create({
  baseURL: process.env.AIS_API.BASE
})

const runSQL = (sqlString) => cartoAPI.query(sqlString)

const searchAIS = (rawAddressString) => {
  return AISAPI
          .get(`/search/${rawAddressString}?gatekeeperKey=${AISAPI_KEY}`)
          .then((res) => {
            let data = res.data
            // check to make sure location exist and has valid geometry data
            if (data.features.length > 0 && (data.features[0].geometry && data.features[0].geometry.type === 'Point')) {
              return data.features[0].geometry.coordinates
            }
            return null
          })
}

/**
 * Given freetext and coordinate serach values
 * query the Carto API to return a list of
 * PPR Facilites sorted by relative distance to coordinates
 * @param  {object} searchParams - UI search fields key value pairs
 * @param  {string} coords  - comma separated latitude and longitude
 * @return {[type]}              [description]
 */
const searchCarto = (searchParams, coords) => {
  let addressSearchQuery = cartoAPI.queryAddressBy(searchParams.fields.freetext, coords)
  console.log(addressSearchQuery)
  return cartoAPI.runQuery(addressSearchQuery)
}

const search = (serachParams) => {
  let fields = serachParams.fields

  if (fields.address !== null || fields.address !== '') {
    return searchAIS(fields.address)
              .then(searchCarto.bind({}, serachParams))
  } else {
    return searchCarto(serachParams, null)
  }
}

export default search
