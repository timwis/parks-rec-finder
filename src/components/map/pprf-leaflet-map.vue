<template>
 <div class="pprf-map-container">
    <v-map ref="leafletMap" id="PPRF-Leaflet-Map" :zoom="zoom" :center="center">

      <v-tilelayer :url="basemap" ></v-tilelayer>
      <v-tilelayer :url="streets" ></v-tilelayer>

      <v-circle-marker
        v-if="userLocation"
        :lat-lng="userLocation"
        :options="{color: 'red', radius: 5, opacity: 1}"
      />
      <v-circle-marker
         v-for="_marker in markers"
          :key="_marker.id"
          :lat-lng="[_marker.lat, _marker.lng]"
          :options="{color: _marker.color}"
      ></v-circle-marker>

    </v-map>
 </div>
</template>

<script>
import {mapState} from 'vuex'
import L from 'leaflet'
import Vue2Leaflet from 'vue2-leaflet'

export default {

  name: 'PPRF-Leaflet-Map',

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.EsriTileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-svg-marker': Vue2Leaflet.SVGMarker,
    'v-circle-marker': Vue2Leaflet.CircleMarker
  },

  computed: {
    ...mapState({
      markers: state => state.entities.marker,
      programs: state => state.entities.program,
      facilities: state => state.entities.facility
    })
  },

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
