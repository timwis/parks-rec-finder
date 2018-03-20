<template>
  <v-marker :lat-lng="latLng">
  </v-marker>
</template>

<script>
import {
  Marker as LeafletMarker,
  Popup as LeafletPopup
} from 'vue2-leaflet'
import L from 'leaflet'

export default {
  props: {
    geometry: Object,
    name: String,
    address: Object
  },
  components: {
    'v-marker': LeafletMarker,
    'v-popup': LeafletPopup
  },
  computed: {
    latLng () {
      return L.latLng([
        this.geometry.coordinates[1],
        this.geometry.coordinates[0]
      ])
    },
    content () {
      return `
        <h3>${this.name}</h3>
      `
    }
  }
}
</script>
