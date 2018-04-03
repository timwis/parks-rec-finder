<template>
  <li>
    <h3>
      <router-link :to="url">
        {{ name }}
      </router-link>
    </h3>
    <p>{{ locationName }}</p>
    <p>{{ fullAddress }}</p>
    <p v-if="ageRange">Ages: {{ ageRange }}</p>
    <p v-if="feeDescription">Cost: {{ feeDescription }}</p>
    <p v-if="gender">Gender: {{ gender }}</p>
  </li>
</template>

<script>
import {
  concatAddress,
  getAgeRange,
  getFeeDescription
} from '~/util'

export default {
  props: {
    id: String,
    name: String,
    slug: String,
    fee: String,
    feeFrequency: String,
    gender: String,
    ageLow: Number,
    ageHigh: Number,
    locationName: String,
    locationAddress: Object
  },
  computed: {
    url () {
      return `/activity/${this.slug}/${this.id}`
    },
    fullAddress () {
      return concatAddress(this.locationAddress)
    },
    ageRange () {
      return getAgeRange(this.ageLow, this.ageHigh)
    },
    feeDescription () {
      return getFeeDescription(this.fee, this.feeFrequency)
    }
  }
}
</script>
