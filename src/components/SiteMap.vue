<template>
  <LeafletMap
    ref="map"
    :zoom="defaultZoom"
    :center="defaultCenter"
  >
    <EsriTileLayer :url="basemap"/>
    <EsriTileLayer :url="labels"/>

    <LeafletMarker
      v-for="activity in activities"
      v-if="activity.facilityGeometry"
      :key="activity.id"
      :lat-lng="activity.facilityGeometry"
      :icon="activityIcon"
    >
      <LeafletPopup :content="getActivityPopupContent(activity)"/>
    </LeafletMarker>

    <LeafletMarker
      v-for="location in locations"
      v-if="location.geometry"
      :key="location.id"
      :lat-lng="location.geometry"
      :icon="locationIcon"
    >
      <LeafletPopup :content="getLocationPopupContent(location)"/>
    </LeafletMarker>

    <LeafletMarker
      v-if="location.geometry"
      :lat-lng="location.geometry"
      :icon="locationIcon"
    />

  </LeafletMap>
</template>


<script>
import {
  Map as LeafletMap,
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'vue2-leaflet'
import EsriTileLayer from '~/components/EsriTileLayer'
import L from 'leaflet'
import 'leaflet-svgicon'

// TODO: Think of a better name for this component...
// Map conflicts with the component used within, but
// SiteMap has a different meaning normally
export default {
  props: {
    activities: Array,
    locations: Array,
    location: Object
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
      labels: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer',
      activityIcon: new L.DivIcon.SVGIcon({
        color: '#2176D2',
        fillOpacity: 1,
        iconSize: [20, 28]
      }),
      locationIcon: new L.DivIcon.SVGIcon({
        color: '#A5097E',
        fillOpacity: 1,
        iconSize: [20, 28]
      })
    }
  },
  watch: {
    location () {
      if (this.location.geometry) {
        const map = this.$refs.map
        map.setCenter(this.location.geometry)
      }
    },
    activities () {
      if (this.activities.length > 0) {
        const geometries = this.activities.map((activity) => activity.facilityGeometry)
        const map = this.$refs.map
        map.fitBounds(geometries)
      }
    },
    locations () {
      if (this.locations.length > 0) {
        const geometries = this.locations.map((location) => location.geometry)
        const map = this.$refs.map
        map.fitBounds(geometries)
      }
    }
  },
  methods: {
    getActivityPopupContent ({ name }) {
      return `
        <h3>${name}</h3>
      `
    },
    getLocationPopupContent ({ name, address }) {
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
