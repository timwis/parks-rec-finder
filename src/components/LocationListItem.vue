<template>
  <li>
    <h3>{{ name }}</h3>
    <p>{{ fullAddress }}</p>
  </li>
</template>

<script>
export default {
  props: {
    name: String,
    address: Object
  },
  computed: {
    fullAddress () {
      const { street, street2, city, state, zip } = this.address
      const order = [ street, street2, city, state, zip ]
      return order
        .filter((part) => part.length > 0)
        .join(', ')
    }
  }
}
</script>
