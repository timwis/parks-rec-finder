<template>
  <div class="pprf-map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import {tiledMapLayer} from 'esri-leaflet'
/* eslint-disable no-new */
import '@/vendor/svg-icon.js'
/**
 * MAPPING IMPLEMENTATION CONTAINER
 *
 *
 */
export default {
  name: 'PPRF-Map',

  data () {
    return {
      defaultLocation: [39.9523893, -75.1636291],
      map: {},
      markerCache: []
    }
  },

  mounted () {
    this.map = L.map(this.$el, {preferCanvas: true}).setView(this.defaultLocation, 14)

    navigator.geolocation.getCurrentPosition(position => {
      // alert(`${position.coords.latitude}, ${position.coords.longitude}`)
      let iconOptions = {
        color: 'rgb(255,0,0)',
        iconSize: [16, 24],
        circleRatio: 0
      }

      /* eslint-disable no-unused-vars */
      let marker = new L
                        .Marker
                        .SVGMarker([position.coords.latitude, position.coords.longitude], {iconOptions})
                        .addTo(this.map)
                        .bindPopup('You Are Here')
                        .openPopup()
    })

    tiledMapLayer({
      url: process.env.ESRI.tiledLayers.basemap,
      tiledLayers: ['cityBasemapLabels']
    }).addTo(this.map)

    tiledMapLayer({
      url: process.env.ESRI.tiledLayers.streets
    }).addTo(this.map)
  },

  watch: {
    markers: function (markersList) {
      this._clearMarkers()
      this.markerCache = markersList.map(_marker => L.circleMarker([_marker.lat, _marker.lng], {color: _marker.color}).addTo(this.map))
    }
  },

  methods: {
    _clearMarkers (markers) {
      for (var i = 0; i < this.markerCache.length; i++) {
        this.map.removeLayer(this.markerCache[i])
      }
    }
  }
}
</script>


<style lang="scss" scoped>

.pprf-map-container{
  flex:1;
  height: $max-app-height;
  display:block;

}
</style>
