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
      v-if="show === 'activities' && activity.facilityGeometry"
      :key="activity.id"
      :lat-lng="activity.facilityGeometry"
      :icon="activityIcon"
    >
      <LeafletPopup :content="getActivityPopupContent(activity)"/>
    </LeafletMarker>

    <LeafletMarker
      v-for="location in locations"
      v-if="show === 'locations' && location.geometry"
      :key="location.id"
      :lat-lng="location.geometry"
      :icon="locationIcon"
    >
      <LeafletPopup :content="getLocationPopupContent(location)"/>
    </LeafletMarker>

    <LeafletMarker
      v-if="show === 'activity' && activity.facilityGeometry"
      :lat-lng="activity.facilityGeometry"
      :icon="activityIcon"
    />

    <LeafletMarker
      v-if="show === 'location' && location.geometry"
      :lat-lng="location.geometry"
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
    activity: Object,
    location: Object,
    show: String,
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
      }),
      searchLocationIcon: new L.DivIcon.SVGIcon({
        color: 'orange'
      })
    }
  },
  updated () {
    this.fitMarkersInMap()
  },
  methods: {
    // Is there a more efficient way to handle this logic?
    fitMarkersInMap () {
      const { show, activities, locations, activity, location, searchLocationGeometry } = this
      const map = this.$refs.map

      if (show === 'activities' && activities.length > 0) {
        const geometries = activities.map((activity) => activity.facilityGeometry)
        if (searchLocationGeometry) {
          const zoomedGeometries = geometries.slice(0, 3)
          zoomedGeometries.push(searchLocationGeometry)
          map.fitBounds(zoomedGeometries)
        } else {
          map.fitBounds(geometries)
        }
      } else if (show === 'locations' && locations.length > 0) {
        const geometries = locations.map((location) => location.geometry)
        if (searchLocationGeometry) {
          const zoomedGeometries = geometries.slice(0, 3)
          zoomedGeometries.push(searchLocationGeometry)
          map.fitBounds(zoomedGeometries)
        } else {
          map.fitBounds(geometries)
        }
      } else if (show === 'activity' && activity.facilityGeometry) {
        map.setCenter(activity.facilityGeometry)
      } else if (show === 'location' && location.geometry) {
        map.setCenter(location.geometry)
      }
    },
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
