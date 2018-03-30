<template>
  <ul>
    <LocationListItem
      v-for="location in locations"
      :key="location.id"
      :id="location.id"
      :name="location.name"
      :address="location.address"
    />
  </ul>
</template>

<script>
import LocationListItem from '~/components/LocationListItem'

export default {
  props: {
    locations: Array
  },
  components: {
    LocationListItem
  }
}
</script>
