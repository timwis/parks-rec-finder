<template>
  <li class="activity-list-item grid-x grid-padding-x">
    <div class="cell small-14">
      <h3 class="overflow-wrap">
        <router-link :to="url">
          {{ name }}
        </router-link>
      </h3>
      <div class="grid-x">
        <div class="cell auto" v-if="ageRange">Ages:<br /> {{ ageRange }}</div>
        <div class="cell auto" v-if="gender">Gender:<br /> {{ gender }}</div>
        <div class="cell auto" v-if="feeDescription">Cost:<br /> {{ feeDescription }}</div>
      </div>
    </div>
    <div class="cell auto">
      <p>{{ locationName }}</p>
      <p>{{ fullAddress }}</p>
    </div>
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
<style lang="sass" scoped>
.activity-list-item
  font-size: .9rem
li
  border-bottom: 1px solid black
  margin-bottom: 1rem
  padding-bottom: 1rem
  &:last-child
    border-bottom: none
</style>
