<template>
  <li class="grid-x grid-padding-x">
    <span class="icon cell small-4">
      <font-awesome-icon
        icon="map-marker-alt"
        size="4x"/>
    </span>
    <div class="location-data cell small-18">
      <h3>
        <router-link :to="url">
          {{ name }}
        </router-link>
      </h3>
      <address>{{ fullAddress }}</address>
    </div>
  </li>
</template>

<script>
import { concatAddress } from '~/util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    address: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    fullAddress () {
      return concatAddress(this.address)
    },
    url () {
      return `/location/${this.slug}/${this.id}`
    }
  }
}
</script>
<style lang="sass" scoped>
.icon
  color: $locations
.location-data
  display: inline-block
li
  margin-bottom: 1rem
  padding-bottom: 1rem
  border-bottom: 1px solid black
  &:last-child
    border-bottom: none
</style>
