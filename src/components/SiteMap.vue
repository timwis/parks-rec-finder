<template>
  <LMap
    ref="map"
    :zoom="defaultZoom"
    :center="defaultCenter"
    :style="{height: fullHeight + 'px'}">
    <LTileLayer
      :url="basemap"
      :tile-layer-class="esriTileLayer"/>
    <LTileLayer
      :url="labels"
      :tile-layer-class="esriTileLayer"/>

    <LMarker
      v-for="activityLocation in uniqueActivityLocations"
      v-if="activityLocation.locationGeometry"
      :key="activityLocation.locationId"
      :lat-lng="activityLocation.locationGeometry"
      :icon="activityIcon">
      <ActivityMarkerPopup
        :location-name="activityLocation.locationName"
        :activities="activityLocation.activities"/>
    </LMarker>

    <LMarker
      v-for="location in locations"
      v-if="location.geometry"
      :key="location.id"
      :lat-lng="location.geometry"
      :icon="locationIcon">
      <LocationMarkerPopup
        :name="location.name"
        :slug="location.slug"
        :phone="location.phone"
        :id="location.id"/>
    </LMarker>

    <LMarker
      v-if="activityDetails && activityDetails.locationGeometry"
      :lat-lng="activityDetails.locationGeometry"
      :icon="activityIcon"/>

    <LMarker
      v-if="locationDetails && locationDetails.geometry"
      :lat-lng="locationDetails.geometry"
      :icon="locationIcon"/>

    <LMarker
      v-if="searchLocationGeometry"
      :lat-lng="searchLocationGeometry"
      :icon="searchLocationIcon"
      data-testid="searchLocationGeometry"/>
  </LMap>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import map from 'lodash/map'
import pick from 'lodash/pick'
import values from 'lodash/values'
import L from 'leaflet'
import 'leaflet-svgicon'
import { tiledMapLayer as EsriTileLayer } from 'esri-leaflet'
import { TILES_BASEMAP, TILES_LABELS } from '~/config'
import ActivityMarkerPopup from '~/components/ActivityMarkerPopup'
import LocationMarkerPopup from '~/components/LocationMarkerPopup'

const headerHeight = 134

// TODO: Think of a better name for this component...
// Map is a reserved element name in HTML, but
// SiteMap has a different meaning normally
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    ActivityMarkerPopup,
    LocationMarkerPopup
  },
  props: {
    activities: {
      type: Array,
      default: null
    },
    locations: {
      type: Array,
      default: null
    },
    activityDetails: {
      type: Object,
      default: null
    },
    locationDetails: {
      type: Object,
      default: null
    },
    searchLocationGeometry: {
      type: Array,
      default: null
    }
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
      }),
      fullHeight: document.documentElement.clientHeight - headerHeight
    }
  },
  computed: {
    // Multiple activities can happen at the same location;
    // only show one marker per location
    uniqueActivityLocations () {
      if (!this.activities || this.activities.length === 0) return

      const uniqueLocations = {}
      this.activities.forEach((activity) => {
        if (!uniqueLocations[activity.locationId]) {
          const locationFields = ['locationId', 'locationName', 'locationGeometry', 'locationAddress']
          uniqueLocations[activity.locationId] = pick(activity, locationFields)
          uniqueLocations[activity.locationId].activities = []
        }
        uniqueLocations[activity.locationId].activities.push(activity)
      })
      return values(uniqueLocations)
    }
  },
  watch: {
    uniqueActivityLocations () {
      if (this.uniqueActivityLocations && this.uniqueActivityLocations.length > 0) {
        const geometries = map(this.uniqueActivityLocations, 'locationGeometry')
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
      if (this.activityDetails && this.activityDetails.locationGeometry) {
        const geometries = [ this.activityDetails.locationGeometry ]
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
  mounted () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy  () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight - headerHeight
      this.$refs.map.mapObject.invalidateSize()
    }
  }
}
</script>

<style lang="sass">
@import "~leaflet/dist/leaflet.css"
</style>
