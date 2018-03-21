<template>
  <li>
    <h3>{{ name }}</h3>
    <p>{{ facilityName }}</p>
    <p>{{ fullAddress }}</p>
    <p v-if="ageRange">Ages: {{ ageRange }}</p>
    <p v-if="feeDescription">Cost: {{ feeDescription }}</p>
    <p v-if="gender">Gender: {{ gender }}</p>
  </li>
</template>

<script>
export default {
  props: {
    name: String,
    fee: String,
    feeFrequency: String,
    gender: String,
    ageLow: Number,
    ageHigh: Number,
    facilityName: String,
    facilityAddress: Object
  },
  computed: {
    fullAddress () {
      const { street, street2, city, state, zip } = this.facilityAddress
      const order = [ street, street2, city, state, zip ]
      return order
        .filter((part) => part && part.length > 0)
        .join(', ')
    },
    ageRange () {
      return [
        this.ageLow,
        this.ageHigh
      ].join('-')
    },
    feeDescription () {
      const { fee, feeFrequency } = this
      if (fee.length === 0 || fee === '0.00') {
        return 'Free'
      } else {
        return [
          '$' + fee,
          feeFrequency.toLowerCase()
        ].join(' ')
      }
    }
  }
}
</script>
