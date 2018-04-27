<template>
  <main>
    <aside
      v-if="isSidebarVisible"
      class="sidebar search-results">
      <div class="grid-y medium-grid-frame">
        <div class="panel-head">
          <h2>Search results</h2>

          <div v-if="isLoading">
            Loading...
          </div>
          <div v-else-if="error">
            Error: {{ error }}
          </div>
          <div v-else>
            <p data-testid="resultsSummary">
              Showing {{ count }} results
              <span v-if="searchTerm">
                for <b>{{ searchTerm }}</b>
              </span>
              <span v-if="searchLocation">
                near <b>{{ searchLocation }}</b>
              </span>
            </p>
          </div>
          <TabSwitcher :active-tab="activeTab">
            <router-link
              slot="activities"
              :to="{ path: '/search/activities', query }">
              Activities ({{ filteredActivities.length }})
            </router-link>
            <router-link
              slot="locations"
              :to="{ path: '/search/locations', query }">
              Locations ({{ locations.length }})
            </router-link>
          </TabSwitcher>

        </div>
        <div v-if="activeTab === 'activities'">
          <ActivityFilterControls
            v-if="activities.length > 0"
            :current-filters="currentFilters"
            @change="setFilters"/>
          <ActivityList :activities="filteredActivities"/>
        </div>

        <LocationList
          v-else-if="activeTab === 'locations'"
          :locations="locations"/>
      </div>
    </aside>
    <button
      class="button toggleMap hide-for-large"
      @click.prevent="showMap">Toggle map</button>
    <section class="map">
      <SiteMap
        v-if="activeTab === 'activities'"
        :activities="filteredActivities"
        :search-location-geometry="searchLocationGeometry"/>
      <SiteMap
        v-else-if="activeTab === 'locations'"
        :locations="locations"
        :search-location-geometry="searchLocationGeometry"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Raven from 'raven-js'
import pick from 'lodash/pick'
import SiteMap from '~/components/SiteMap'
import ActivityFilterControls from '~/components/ActivityFilterControls'
import ActivityList from '~/components/ActivityList'
import LocationList from '~/components/LocationList'
import TabSwitcher from '~/components/TabSwitcher'

export default {
  components: {
    SiteMap,
    ActivityFilterControls,
    ActivityList,
    LocationList,
    TabSwitcher
  },
  props: {
    activeTab: {
      type: String, // activities or locations
      default: 'activities'
    }
  },
  data () {
    return {
      error: null,
      isLoading: false,
      isSidebarVisible: true
    }
  },
  computed: {
    ...mapState({
      searchTerm: (state) => state.route.query.term || state.route.query.freetext, // backwards compatibility w/v1.0
      searchLocation: (state) => state.route.query.location,
      activities: (state) => state.activities,
      locations: (state) => state.locations,
      searchLocationGeometry: (state) => state.searchLocationGeometry
    }),
    ...mapGetters([
      'currentFilters',
      'filteredActivities'
    ]),
    count () {
      return this.filteredActivities.length + this.locations.length
    },
    query () {
      return this.$route.query
    }
  },
  watch: {
    searchTerm: 'fetch',
    searchLocation: 'fetch'
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetSearchActivitiesAndLocations()
  },
  methods: {
    ...mapActions([
      'searchActivitiesAndLocations',
      'resetSearchActivitiesAndLocations',
      'setFilters'
    ]),
    async fetch () {
      if (this.searchTerm || this.searchLocation) {
        this.error = null
        this.isLoading = true
        const filters = pick(this, ['searchTerm', 'searchLocation'])
        try {
          await this.searchActivitiesAndLocations(filters)
        } catch (err) {
          this.error = err.message
          Raven.captureException(err)
        } finally {
          this.isLoading = false
          this.switchTabsIfEmpty()
        }
      }
    },
    switchTabsIfEmpty () {
      if (this.activeTab === 'activities' &&
          this.activities.length === 0 &&
          this.locations.length > 0) {
        this.$router.replace({
          path: '/search/locations',
          query: this.query
        })
      }
    },
    showMap () {
      this.isSidebarVisible = !this.isSidebarVisible
    }
  },
  metaInfo () {
    let title = 'Search results'
    if (this.searchTerm) title += ` for ${this.searchTerm}`
    if (this.searchLocation) title += ` near ${this.searchLocation}`

    return {
      title
    }
  }
}
</script>
<style lang="sass" scoped>
.panel-head
  padding: 1rem
h2
  margin-top: 0

</style>
