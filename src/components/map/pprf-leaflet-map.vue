<template>
 <div class="pprf-map__container">
    <v-map ref="leafletMap" id="PPRF-Leaflet-Map" :zoom="zoom" :center="center">

      <v-tilelayer :url="basemap" ></v-tilelayer>
      <v-tilelayer :url="streets" ></v-tilelayer>

      <v-svg-marker
        v-if="userLocation"
        :latLng="userLocation"
        :options="userPinOptions"
      >
        <v-popup content="You are here" />
      </v-svg-marker>

      <v-svg-marker
          v-for="marker in markers"
          @l-click="onMarkerClick(marker)"
          :key="marker.id"
          :latLng="[marker.lat, marker.lng]"
          :options="{iconOptions:{color: marker.color, opacity: marker.opacity, iconSize: marker.size, fillOpacity: marker.opacity, circleFillOpacity: marker.opacity, circleOpacity: marker.opacity}}"
      >
        <v-popup :content="marker.content()" />
      </v-svg-marker>

    </v-map>
 </div>
</template>

<script>
import L from 'leaflet'
import Vue2Leaflet from 'vue2-leaflet'
import {mapState} from 'vuex'
import {EventBus} from '@/event-bus'

export default {

  name: 'PPRF-Leaflet-Map',

  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.EsriTileLayer,
    'v-popup': Vue2Leaflet.Popup,
    'v-svg-marker': Vue2Leaflet.SVGMarker,
    'v-circle-marker': Vue2Leaflet.CircleMarker
  },

  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('resetMarkers')
    next()
  },

  updated () {
    this.fitToMarkerBounds()
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
      markers: state => state.mapMarkers,
      zipcodeSearched: state => state.search.fields.zip
    }),
    activeEntity () {
      let entityTypeParam = this.$store.state.route.params.entityType
      if (entityTypeParam) {
        return entityTypeParam === 'locations'
        ? 'facility'
        : 'program'
      }
      return this.$store.state.activeTab
    }
  },

  mounted () {
    navigator.geolocation.getCurrentPosition(position => {
      this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude)
    })
  },

  methods: {
    fitToMarkerBounds () {
      let _markers = this.markers
      // @TODO: don't add zipcode zoom until polygons are added
      // if (this.zipcodeSearched) {
      //   _markers = this.markers.filter(marker => marker.within_zip_code)
      // }
      if (_markers && _markers.length) {
        let markersLatLng = _markers.map(marker => L.latLng(marker.lat, marker.lng))
        /* eslint-disable new-cap */
        let {_southWest, _northEast} = L.latLngBounds(markersLatLng)
        this.$refs.leafletMap.fitBounds([[_southWest.lat, _southWest.lng], [_northEast.lat, _northEast.lng]])
      }
    },
    onMarkerClick (marker) {
      EventBus.$emit('map:markerClick', marker)
    }
  }
}
</script>

<style lang="scss" scoped>

  .pprf-map__container{
    flex:1;
    width: 100%;
    display: block;
    height:calc(#{$max-app-height} - #{$header-height});
  }
</style>
