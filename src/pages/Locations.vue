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

        <LocationList :locations="locations"/>
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
import LocationList from '~/components/LocationList'

export default {
  components: {
    SiteMap,
    LocationList
  },
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      categorySlug: (state) => state.route.params.categorySlug,
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
  },
  metaInfo () {
    return {
      title: this.categoryName
    }
  }
}
</script>

