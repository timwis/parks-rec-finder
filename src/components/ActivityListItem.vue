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
    fee: {
      type: String,
      default: ''
    },
    feeFrequency: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: ''
    },
    ageLow: {
      type: Number,
      required: true
    },
    ageHigh: {
      type: Number,
      required: true
    },
    locationName: {
      type: String,
      required: true
    },
    locationAddress: {
      type: Object,
      required: true
    }
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
