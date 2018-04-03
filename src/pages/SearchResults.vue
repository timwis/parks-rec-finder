<template>
  <main>
    <aside class="list">
      <h2>Search results</h2>

      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        Error: {{ error }}
      </div>
      <div v-else>
        <p>
          Showing {{ count }} results
          for {{ searchTerm }}
        </p>

        <TabSwitcher :active-tab="activeTab">
          <router-link
            slot="activities"
            :to="{ path: '/search/activities', query }"
          >
            Activities ({{ filteredActivities.length }})
          </router-link>
          <router-link
            slot="locations"
            :to="{ path: '/search/locations', query }"
          >
            Locations ({{ locations.length }})
          </router-link>
        </TabSwitcher>

        <div v-if="activeTab === 'activities'">
          <ActivityFilterControls
            :current-filters="currentFilters"
            @change="setFilters"
          />

          <ActivityList :activities="filteredActivities"/>
        </div>

        <LocationList
          v-else-if="activeTab === 'locations'"
          :locations="locations"
        />
      </div>
    </aside>
    <section class="map">
      <SiteMap
        v-if="activeTab === 'activities'"
        :activities="filteredActivities"
        :search-location-geometry="searchLocationGeometry"
      />
      <SiteMap
        v-else-if="activeTab === 'locations'"
        :locations="locations"
        :search-location-geometry="searchLocationGeometry"
      />
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import pick from 'lodash/pick'
import SiteMap from '~/components/SiteMap'
import ActivityFilterControls from '~/components/ActivityFilterControls'
import ActivityList from '~/components/ActivityList'
import LocationList from '~/components/LocationList'
import TabSwitcher from '~/components/TabSwitcher'

export default {
  props: {
    activeTab: String // activities or locations
  },
  components: {
    SiteMap,
    ActivityFilterControls,
    ActivityList,
    LocationList,
    TabSwitcher
  },
  data () {
    return {
      error: null,
      isLoading: false
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
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetSearchActivitiesAndLocations()
  },
  watch: {
    searchTerm: 'fetch',
    searchLocation: 'fetch'
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
        } finally {
          this.isLoading = false
        }
      }
    }
  },
  metaInfo () {
    return {
      title: `Search results for ${this.searchTerm}`
    }
  }
}
</script>

