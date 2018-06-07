<template>
  <div class="cell medium-cell-block-y medium-cell-block-container results-container">
    <ul class="no-bullet">
      <LocationListItem
        v-for="location in locations"
        :key="location.id"
        :id="location.id"
        :name="location.name"
        :slug="location.slug"
        :address="location.address"
        data-testid="locationListItem"/>
    </ul>
  </div>
</template>

<script>
import LocationListItem from '~/components/LocationListItem'

export default {
  components: {
    LocationListItem
  },
  props: {
    locations: {
      type: Array,
      required: true
    }
  }
}
</script>
