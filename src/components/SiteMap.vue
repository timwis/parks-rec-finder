<template>
  <Map :zoom=13 :center="defaultCenter">
    <EsriTileLayer :url="basemap"/>
    <EsriTileLayer :url="labels"/>
  </Map>
</template>


<script>
import { Map } from 'vue2-leaflet'
import EsriTileLayer from '~/components/EsriTileLayer'

// TODO: Think of a better name for this component...
// Map conflicts with the component used within, but
// SiteMap has a different meaning normally
export default {
  components: {
    Map,
    EsriTileLayer
  },
  data () {
    return {
      defaultZoom: 13,
      defaultCenter: [39.9523893, -75.1636291],
      basemap: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
      labels: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer'
    }
  }
}
</script>


<style lang="sass">
@import "~leaflet/dist/leaflet.css"
</style>
