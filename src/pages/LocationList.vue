<template>
  <div>
    <h2>{{ categoryName }}</h2>
    <p>({{ count }})</p>

    <ul>
      <LocationListItem
        v-for="location in locations"
        :key="location.id"
        :id="location.id"
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
    categorySlug: String
  },
  components: {
    LocationListItem
  },
  computed: {
    ...mapState({
      locations: (state) => state.locations,
      categoryId: (state) => state.locationCategoryDetails.id,
      categoryName: (state) => state.locationCategoryDetails.name
    }),
    count () {
      return this.locations.length
    }
  },
  created () {
    this.getLocationsByCategorySlug(this.categorySlug)
  },
  destroyed () {
    this.resetLocationCategoryDetails()
    this.resetLocations()
  },
  watch: {
    categorySlug () {
      this.getLocationsByCategorySlug(this.categorySlug)
    }
  },
  methods: {
    ...mapActions([
      'getLocationsByCategorySlug'
    ]),
    ...mapMutations({
      resetLocationCategoryDetails: 'RESET_LOCATION_CATEGORY_DETAILS',
      resetLocations: 'RESET_LOCATIONS'
    })
  }
}
</script>

