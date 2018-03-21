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
  async created () {
    await this.getLocationCategoryDetails(this.categorySlug)
    this.getLocations({ categoryId: this.categoryId })
  },
  destroyed () {
    this.resetLocationCategoryDetails()
    this.resetLocations()
  },
  watch: {
    async categorySlug () {
      await this.getLocationCategoryDetails(this.categorySlug)
      this.getLocations({ categoryId: this.categoryId })
    }
  },
  methods: {
    ...mapActions([
      'getLocationCategoryDetails',
      'getLocations'
    ]),
    ...mapMutations({
      resetLocationCategoryDetails: 'RESET_LOCATION_CATEGORY_DETAILS',
      resetLocations: 'RESET_LOCATIONS'
    })
  }
}
</script>

