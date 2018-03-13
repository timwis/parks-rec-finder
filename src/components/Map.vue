<template lang="pug">
  v-map(:zoom=13 :center='[39.9523893, -75.1636291]')
    v-tilelayer(:url='basemap' :tileLayerClass='tileLayerClass')
    v-tilelayer(:url='labels' :tileLayerClass='tileLayerClass')
</template>

<script>
import { Map, TileLayer } from 'vue2-leaflet'
import * as esri from 'esri-leaflet'

export default {
  components: {
    'v-map': Map,
    'v-tilelayer': TileLayer
  },
  data () {
    // console.log(esri)
    return {
      // tileLayerClass: esri.tiledMapLayer,
      tileLayerClass: function () {
        console.log('called tileLayerClass', arguments)
      },
      basemap: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
      labels: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer'
    }
  }
}
</script>


<style lang="sass">
@import "~leaflet/dist/leaflet.css"
</style>
