<template>
 <div class="pprf-map-container">
    <v-map ref="leafletMap" id="PPRF-Leaflet-Map" :zoom="zoom" :center="center">

      <v-tilelayer :url="basemap" ></v-tilelayer>
      <v-tilelayer :url="streets" ></v-tilelayer>

      <v-svg-marker
        v-if="userLocation"
        :latLng="userLocation"
        :options="userPinOptions"
      />
      <v-svg-marker
          v-for="marker in markers"
          :key="marker.id"
          :latLng="[marker.lat, marker.lng]"
          :options='{iconOptions:{color: marker.color, fillOpacity: 1, iconSize: [20, 28]}}'
      />

    </v-map>
 </div>
</template>

<script>
import L from 'leaflet'
import Vue2Leaflet from 'vue2-leaflet'
import {mapState} from 'vuex'

export default {

  name: 'PPRF-Leaflet-Map',

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.EsriTileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-svg-marker': Vue2Leaflet.SVGMarker,
    'v-circle-marker': Vue2Leaflet.CircleMarker
  },

  data () {
    return {
      zoom: 14,
      center: [39.9523893, -75.1636291],
      basemap: process.env.ESRI.tiledLayers.basemap,
      streets: process.env.ESRI.tiledLayers.streets,
      userLocation: null,
      userPinOptions: {
        iconOptions: {
          fillOpacity: 1,
          color: 'rgb(204,48,0)'
        }
      }
    }
  },

  computed: {
    ...mapState({
      markers: state => state.entities.marker
    })
  },

  mounted () {
    navigator.geolocation.getCurrentPosition(position => {
      this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude)
    })
  },

  updated () {
    this.fitToMarkerBounds()
  },

  methods: {
    fitToMarkerBounds () {
      if (this.markers && this.markers.length) {
        let markersLatLng = this.markers.map(marker => L.latLng(marker.lat, marker.lng))
        /* eslint-disable new-cap */
        let {_southWest, _northEast} = L.latLngBounds(markersLatLng)
        this.$refs.leafletMap.fitBounds([[_southWest.lat, _southWest.lng], [_northEast.lat, _northEast.lng]])
      }
    }
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
