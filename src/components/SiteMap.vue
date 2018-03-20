<template>
  <LeafletMap :zoom=13 :center="defaultCenter">
    <EsriTileLayer :url="basemap"/>
    <EsriTileLayer :url="labels"/>
    <LeafletMarker
      v-for="location in locations"
      :key="location.id"
      :lat-lng="getLatLng(location.geometry)"
      :title="location.name"
    >
      <LeafletPopup :content="getPopupContent(location)"/>
    </LeafletMarker>
  </LeafletMap>
</template>


<script>
import {
  Map as LeafletMap,
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'vue2-leaflet'
import EsriTileLayer from '~/components/EsriTileLayer'

// TODO: Think of a better name for this component...
// Map conflicts with the component used within, but
// SiteMap has a different meaning normally
export default {
  props: {
    locations: Array
  },
  components: {
    LeafletMap, 
    EsriTileLayer,
    LeafletMarker,
    LeafletPopup
  },
  data () {
    return {
      defaultZoom: 13,
      defaultCenter: [39.9523893, -75.1636291],
      basemap: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
      labels: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer'
    }
  },
  methods: {
    getLatLng (geojson) {
      return [
        geojson.coordinates[1],
        geojson.coordinates[0]
      ]
    },
    getPopupContent ({ name, address }) {
      return `
        <h3>${name}</h3>
      `
    }
  }
}
</script>


<style lang="sass">
@import "~leaflet/dist/leaflet.css"
</style>
