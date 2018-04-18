<template>
  <li>
    <span class="icon">
      <font-awesome-icon
        :icon="icon"
        size="4x"/>
    </span>
    <h3>
      <router-link :to="url">
        {{ name }}
      </router-link>
    </h3>
    <p>{{ fullAddress }}</p>
  </li>
</template>

<script>
import { concatAddress } from '~/util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'

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
    icon () {
      return faMapMarkerAlt
    },
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
</style>
