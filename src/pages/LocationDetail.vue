<template>
  <div>
    <h2>{{ name }}</h2>

    <div v-if="fullAddress">
      <h4>Location</h4>
      <p>{{ fullAddress }}</p>
      <p><a :href="directionsUrl" class="external">Get directions</a></p>
    </div>

    <div v-if="phone">
      <h4>Contact</h4>
      <a :href="phoneUrl">{{ phone }}</a>
    </div>

    <div v-if="description">
      <h4>About this location</h4>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { concatAddress } from '~/util'

export default {
  props: {
    id: String
  },
  computed: {
    ...mapState({
      name: (state) => state.location.name,
      description: (state) => state.location.description,
      fullAddress: (state) => concatAddress(state.location.address),
      phone: (state) => state.location.phone
    }),
    directionsUrl () {
      return `https://www.google.com/maps/dir/?api=1&query=${this.fullAddress}`
    },
    phoneUrl () {
      return `tel:${this.phone}`
    }
  },
  created () {
    this.getLocation(this.id)
  },
  destroyed () {
    this.resetLocation()
  },
  watch: {
    id (newId) {
      this.getLocation(this.id)
    }
  },
  methods: {
    ...mapActions([
      'getLocation'
    ]),
    ...mapMutations({
      resetLocation: 'RESET_LOCATION'
    })
  }
}
</script>
