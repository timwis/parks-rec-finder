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
      v-if="activityDetails && activityDetails.facilityGeometry"
      :lat-lng="activityDetails.facilityGeometry"
      :icon="activityIcon"
    />

    <LeafletMarker
      v-if="locationDetails && locationDetails.geometry"
      :lat-lng="locationDetails.geometry"
      :icon="locationIcon"
    />

    <LeafletMarker
      v-if="searchLocationGeometry"
      :lat-lng="searchLocationGeometry"
      :icon="searchLocationIcon"
    />

  </LeafletMap>
</template>


<script>
import {
  Map as LeafletMap,
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'vue2-leaflet'
import map from 'lodash/map'
import L from 'leaflet'
import 'leaflet-svgicon'
import EsriTileLayer from '~/components/EsriTileLayer'
import { TILES_BASEMAP, TILES_LABELS } from '~/config'

// TODO: Think of a better name for this component...
// Map conflicts with the component used within, but
// SiteMap has a different meaning normally
export default {
  props: {
    activities: Array,
    locations: Array,
    activityDetails: Object,
    locationDetails: Object,
    searchLocationGeometry: Array
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
      basemap: TILES_BASEMAP,
      labels: TILES_LABELS,
      activityIcon: new L.DivIcon.SVGIcon({
        color: '#2176D2',
        fillOpacity: 1,
        iconSize: [20, 28]
      }),
      locationIcon: new L.DivIcon.SVGIcon({
        color: '#A5097E',
        fillOpacity: 1,
        iconSize: [20, 28]
      }),
      searchLocationIcon: new L.DivIcon.SVGIcon({
        color: 'orange'
      })
    }
  },
  watch: {
    activities () {
      if (this.activities && this.activities.length > 0) {
        const geometries = map(this.activities, 'facilityGeometry')
        if (this.searchLocationGeometry) {
          geometries.splice(3)
          geometries.push(this.searchLocationGeometry)
        }
        this.$refs.map.fitBounds(geometries)
      }
    },
    locations () {
      if (this.locations && this.locations.length > 0) {
        const geometries = map(this.locations, 'geometry')
        if (this.searchLocationGeometry) {
          geometries.splice(3)
          geometries.push(this.searchLocationGeometry)
        }
        this.$refs.map.fitBounds(geometries)
      }
    },
    activityDetails () {
      if (this.activityDetails && this.activityDetails.facilityGeometry) {
        const geometries = [ this.activityDetails.facilityGeometry ]
        this.$refs.map.fitBounds(geometries)
      }
    },
    locationDetails () {
      if (this.locationDetails && this.locationDetails.geometry) {
        const geometries = [ this.locationDetails.geometry ]
        this.$refs.map.fitBounds(geometries)
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
