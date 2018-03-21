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
    id: String,
    name: String,
    address: Object
  },
  computed: {
    fullAddress () {
      return concatAddress(this.address)
    },
    url () {
      return `/location/${this.id}`
    }
  }
}
</script>
