<template>
 <div class="pprf-map-container">
    <v-map ref="leafletMap" id="PPRF-Leaflet-Map" :zoom="zoom" :center="center">

      <v-tilelayer :url="basemap" ></v-tilelayer>
      <v-tilelayer :url="streets" ></v-tilelayer>

      <v-circle-marker
        v-if="userLocation"
        :lat-lng="userLocation"
      />
      <v-circle-marker
          v-for="marker in markers"
          :key="marker.id"
          :lat-lng="[marker.lat, marker.lng]"
      ></v-circle-marker>

    </v-map>
 </div>
</template>

<script>
import L from 'leaflet'
import Vue2Leaflet from 'vue2-leaflet'
import entitiesListData from '@/mixins/entities-list-data'

export default {

  name: 'PPRF-Leaflet-Map',

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.EsriTileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-svg-marker': Vue2Leaflet.SVGMarker,
    'v-circle-marker': Vue2Leaflet.CircleMarker
  },

  mixins: [entitiesListData],

  data () {
    return {
      zoom: 14,
      center: [39.9523893, -75.1636291],
      basemap: process.env.ESRI.tiledLayers.basemap,
      streets: process.env.ESRI.tiledLayers.streets,
      userLocation: null
    }
  },

  mounted () {
    navigator.geolocation.getCurrentPosition(position => {
      this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude)
    })
  }
}
</script>

<style lang="scss" scoped>

  .pprf-map-container{
    flex:1;
    width: 100%;
    height:$max-app-height;
  }
</style>
