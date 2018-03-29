<template>
  <main>
    <aside class="list">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        Error: {{ error }}
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
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      locations: (state) => state.locations,
      categoryId: (state) => state.locationCategoryDetails.id,
      categoryName: (state) => state.locationCategoryDetails.name
    }),
    count () {
      return this.locations.length
    },
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetLocationsByCategorySlug()
  },
  watch: {
    categorySlug: 'fetch'
  },
  methods: {
    ...mapActions([
      'getLocationsByCategorySlug',
      'resetLocationsByCategorySlug'
    ]),
    async fetch () {
      this.error = null
      this.isLoading = true
      try {
        await this.getLocationsByCategorySlug(this.categorySlug)
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

