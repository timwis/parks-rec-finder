import axios from 'axios'
import squel from 'squel'

const cartoAPI = axios.create({
  baseURL: process.env.CARTO_API.BASE
})

const AISAPI_KEY = process.env.AIS_API.KEY
const AISAPI = axios.create({
  baseURL: process.env.AIS_API.BASE
})

const runSQL = (sqlString) => cartoAPI.get(`sql?q=${sqlString}`)

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

const searchCarto = (serachParams, coords) => {
  let coordinates = coords ? coords.join(',') : null
  // get all facilities filter by user input freetext
  // and ordered by distance

  let sqlQuery = squel.select('ppr_facilities.*').from('ppr_facilities')

  if (coordinates) {
    sqlQuery.field(`ST_Distance(
                      ST_Centroid(ppr_assets.the_geom),
                      ST_SetSRID(
                        ST_Point(${coordinates}),
                        4326
                      )
                    ) as distance`)
              .join('ppr_assets', null, 'ppr_assets.objectid = ppr_assets_objectid')
              .order('distance')
  }

  if (serachParams.fields.freetext !== null && serachParams.fields.freetext !== '') {
    sqlQuery.where(`ILIKE = '%${serachParams.fields.freetext}%'`)
  }
  console.log(sqlQuery.toString())
  return runSQL(sqlQuery.toString())
}

const search = (serachParams) => {
  let fields = serachParams.fields
  console.log(fields)
  if (fields.address !== null || fields.address !== '') {
    return searchAIS(fields.address)
              .then(searchCarto.bind({}, serachParams))
  } else {
    return searchCarto(serachParams, null)
  }
}

export default search
