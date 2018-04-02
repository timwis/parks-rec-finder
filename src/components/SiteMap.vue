<template>
  <LMap
    ref="map"
    :zoom="defaultZoom"
    :center="defaultCenter"
  >
    <LTileLayer :url="basemap" :tile-layer-class="esriTileLayer"/>
    <LTileLayer :url="labels" :tile-layer-class="esriTileLayer"/>

    <LMarker
      v-for="activityLocation in uniqueActivityLocations"
      v-if="activityLocation.facilityGeometry"
      :key="activityLocation.facilityId"
      :lat-lng="activityLocation.facilityGeometry"
      :icon="activityIcon"
    >
      <ActivityMarkerPopup
        :facility-name="activityLocation.facilityName"
        :activities="activityLocation.activities"
      />
    </LMarker>

    <LMarker
      v-for="location in locations"
      v-if="location.geometry"
      :key="location.id"
      :lat-lng="location.geometry"
      :icon="locationIcon"
    >
      <LocationMarkerPopup
        :name="location.name"
        :phone="location.phone"
        :id="location.id"
      />
    </LMarker>

    <LMarker
      v-if="activityDetails && activityDetails.facilityGeometry"
      :lat-lng="activityDetails.facilityGeometry"
      :icon="activityIcon"
    />

    <LMarker
      v-if="locationDetails && locationDetails.geometry"
      :lat-lng="locationDetails.geometry"
      :icon="locationIcon"
    />

    <LMarker
      v-if="searchLocationGeometry"
      :lat-lng="searchLocationGeometry"
      :icon="searchLocationIcon"
    />

  </LMap>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import map from 'lodash/map'
import pick from 'lodash/pick'
import values from 'lodash/values'
import L from 'leaflet'
import 'leaflet-svgicon'
import { tiledMapLayer as EsriTileLayer } from 'esri-leaflet'
import { TILES_BASEMAP, TILES_LABELS } from '~/config'
import ActivityMarkerPopup from '~/components/ActivityMarkerPopup'
import LocationMarkerPopup from '~/components/LocationMarkerPopup'

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
    LMap, 
    LTileLayer,
    LMarker,
    ActivityMarkerPopup,
    LocationMarkerPopup
  },
  data () {
    return {
      defaultZoom: 13,
      defaultCenter: [39.9523893, -75.1636291],
      basemap: TILES_BASEMAP,
      labels: TILES_LABELS,
      esriTileLayer: (url, options) => EsriTileLayer({ url, ...options }),
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
  computed: {
    // Multiple activities can happen at the same location;
    // only show one marker per location
    uniqueActivityLocations () {
      if (!this.activities || this.activities.length === 0) return

      const uniqueLocations = {}
      this.activities.forEach((activity) => {
        if (!uniqueLocations[activity.facilityId]) {
          const locationFields = ['facilityId', 'facilityName', 'facilityGeometry', 'facilityAddress']
          uniqueLocations[activity.facilityId] = pick(activity, locationFields)
          uniqueLocations[activity.facilityId].activities = []
        }
        uniqueLocations[activity.facilityId].activities.push(activity)
      })
      return values(uniqueLocations)
    }
  },
  watch: {
    uniqueActivityLocations () {
      if (this.uniqueActivityLocations && this.uniqueActivityLocations.length > 0) {
        const geometries = map(this.uniqueActivityLocations, 'facilityGeometry')
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
  }
}
</script>


<style lang="sass">
@import "~leaflet/dist/leaflet.css"
</style>
