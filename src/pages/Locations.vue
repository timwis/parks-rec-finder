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
        <div
          class="panel-head locations">
          <h2 data-testid="categoryName">{{ categoryName }}</h2>
          <ItemCount
            :count="count" />
        </div>
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
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import LocationList from '~/components/LocationList'
import ItemCount from '~/components/ItemCount'

export default {
  components: {
    SiteMap,
    LocationList,
    ItemCount
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
    }
  },
  watch: {
    categorySlug: 'fetch'
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetLocationsByCategorySlug()
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
        Raven.captureException(err)
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

<style lang="sass" scoped>
  .panel-head.locations
    +fixed-header($locations)
    color: white
    padding: 1rem
</style>
