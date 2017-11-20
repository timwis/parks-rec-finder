<template>
  <div class="pprf-map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import {tiledMapLayer} from 'esri-leaflet'
import entitiesListData from '@/mixins/entities-list-data'
/* eslint-disable no-new */
import '@/vendor/svg-icon.js'
/**
 * MAPPING IMPLEMENTATION CONTAINER
 *
 *
 */
export default {
  name: 'PPRF-Map',

  mixins: [entitiesListData],

  data () {
    return {
      defaultLocation: [39.9523893, -75.1636291],
      map: {},
      markers: []
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
    // @TODO figure out why this causes a browser lag
    facilities: function (locations) {
      this.$Progress.finish()
      if (this.markers.length) {
        for (var i = 0; i < this.markers.length; i++) {
          this.map.removeLayer(this.markers[i])
        }
      }

      let _markerOptions = {
        color: '#3388ff'
      }

      this.markers = locations.map(_loc => L.circleMarker([_loc.latitude, _loc.longitude], _markerOptions).addTo(this.map))
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
