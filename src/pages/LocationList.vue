<template>
  <main>
    <aside class="list">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else>
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
    </aside>
    <section class="map">
      <SiteMap :locations="locations"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteMap from '~/components/SiteMap'
import LocationListItem from '~/components/LocationListItem'

export default {
  props: {
    categorySlug: String
  },
  components: {
    SiteMap,
    LocationListItem
  },
  computed: {
    ...mapState({
      locations: (state) => state.locations,
      categoryId: (state) => state.locationCategoryDetails.id,
      categoryName: (state) => state.locationCategoryDetails.name,
      pendingRequests: (state) => state.pendingRequests
    }),
    count () {
      return this.locations.length
    },
    isLoading () {
      return this.pendingRequests.hasOwnProperty('getLocationsByCategorySlug')
    },
  },
  created () {
    this.getLocationsByCategorySlug(this.categorySlug)
  },
  destroyed () {
    this.resetLocationsByCategorySlug()
  },
  watch: {
    categorySlug () {
      this.getLocationsByCategorySlug(this.categorySlug)
    }
  },
  methods: mapActions([
    'getLocationsByCategorySlug',
    'resetLocationsByCategorySlug'
  ])
}
</script>

