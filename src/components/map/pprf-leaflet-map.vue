<template>
 <div  class="pprf-map__container">

   <div v-show="loading" class="loading-overlay"></div>

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

  mounted () {
    navigator.geolocation.getCurrentPosition(position => {
      this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude)
    })
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
      zipcodeSearched: state => state.search.fields.zip,
      loading: state => state.loading
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

<style lang="scss" >
  .loading-overlay{
    position:absolute;
    display:block;
    top:0;
    left:0;
    width:100%;
    height:calc(#{$max-app-height} - #{$header-height} - #{$footer-height});
    background: rgba(0,0,0,.85);
    z-index: 100000;
    pointer-events: none;
  }
  .pprf-map__container{
    flex:1;
    width: 100%;
    position:relative;
    display: block;
    height:calc(#{$max-app-height} - #{$header-height} - #{$footer-height} + 20px);
  }

  .leaflet-control-zoom{
    position: fixed;
    bottom: 60px;
    right: 20px;
    z-index: 1;
    border: 3px solid color(ben-franklin-blue) !important;
    color: color(ben-franklin-blue) !important;
    border-radius: 0px !important;
    * { border-radius: 0px !important; }
  }
  .leaflet-popup {
    .leaflet-popup-content-wrapper {
      border-radius: $border-radius;
      h3{
        font:{
          family: $font-montserrat;
          weight: 700;
        };
        color: color(dark-ben-franklin);
      }
    }
  }


@include breakpoint (medium down) {
  .pprf-map__container{
    position: absolute;
    height:calc(#{$max-app-height} - #{$header-height-mobile} - 148px);
    top: calc(#{$header-height-mobile} + 88px);
    z-index:1;
  }
}
</style>
