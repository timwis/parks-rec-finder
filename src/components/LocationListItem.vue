<template>
  <li>
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

export default {
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
