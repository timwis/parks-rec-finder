<template>
  <div>
    <h2>{{ locationCategoryDetails.name }}</h2>
    <p>({{ count }})</p>

    <ul>
      <LocationListItem
        v-for="location in locations"
        :key="location.id"
        :name="location.name"
        :address="location.address"
      />
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import LocationListItem from '~/components/LocationListItem'

export default {
  props: {
    category: String
  },
  components: {
    LocationListItem
  },
  computed: {
    ...mapState([
      'locations',
      'locationCategoryDetails'
    ]),
    count () {
      return this.locations.length
    }
  },
  created () {
    this.getLocations({ category: this.category })
  },
  destroyed () {
    this.resetLocations()
  },
  watch: {
    category (newCategory) {
      this.getLocations({ category: newCategory })
    }
  },
  methods: {
    ...mapActions([
      'getLocations'
    ]),
    ...mapMutations({
      resetLocations: 'RESET_LOCATIONS'
    })
  }
}
</script>

