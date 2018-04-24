<template>
  <main>
    <aside
      v-if="isSidebarVisible"
      class="sidebar">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        Error: {{ error }}
      </div>
      <div
        v-else
        class="grid-y medium-grid-frame">
        <div
          class="panel-head locations cell shrink medium-cell-block-container">
          <h2 data-testid="categoryName">{{ categoryName }}</h2>
          <ItemCount
            :count="count" />
        </div>
        <LocationList :locations="locations"/>
      </div>
    </aside>
    <button
      class="button toggleMap hide-for-large"
      @click.prevent="showMap">Toggle map</button>
    <section class="map">
      <SiteMap
        :locations="locations"
        :map-visibility="isMapVisible"/>
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
      isLoading: false,
      isMapVisible: window.matchMedia('(max-width: 63.9375em)').matches !== 1,
      isSidebarVisible: true
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
    },
    showMap () {
      this.isMapVisible = !this.isMapVisible
      this.isSidebarVisible = !this.isSidebarVisible
    },
    sidebarVisible () {
      this.isSidebarVisible = !this.isSidebarVisible
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
    padding: 0 1rem
    position: relative

</style>
