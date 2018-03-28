<template>
  <main>
    <aside class="list">
      <h2>Search results</h2>

      <div v-if="isLoading">
        Loading...
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
            Activities ({{ activities.length }})
          </router-link>
          <router-link
            slot="locations"
            :to="{ path: '/search/locations', query }"
          >
            Locations ({{ locations.length }})
          </router-link>
        </TabSwitcher>

        <ul v-if="activeTab === 'activities'">
          <ActivityListItem
            v-for="activity in activities"
            :key="activity.id"
            :id="activity.id"
            :name="activity.name"
            :fee="activity.fee"
            :fee-frequency="activity.feeFrequency"
            :gender="activity.gender"
            :age-low="activity.ageLow"
            :age-high="activity.ageHigh"
            :facility-name="activity.facilityName"
            :facility-address="activity.facilityAddress"
          />
        </ul>

        <ul v-else-if="activeTab === 'locations'">
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
      <SiteMap
        v-if="activeTab === 'activities'"
        :activities="activities"
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
import { mapState, mapActions } from 'vuex'
import pick from 'lodash/pick'
import SiteMap from '~/components/SiteMap'
import ActivityListItem from '~/components/ActivityListItem'
import LocationListItem from '~/components/LocationListItem'
import TabSwitcher from '~/components/TabSwitcher'

export default {
  props: {
    activeTab: String, // activities or locations
    searchTerm: String,
    searchLocation: String
  },
  components: {
    SiteMap,
    ActivityListItem,
    LocationListItem,
    TabSwitcher
  },
  computed: {
    ...mapState([
      'activities',
      'locations',
      'searchLocationGeometry',
      'pendingRequests'
    ]),
    isLoading () {
      return this.pendingRequests.hasOwnProperty('getActivitiesByCategorySlug')
    },
    count () {
      return this.activities.length + this.locations.length
    },
    query () {
      return {
        term: this.searchTerm,
        location: this.searchLocation
      }
    }
  },
  created () {
    this.search()
  },
  destroyed () {
    this.resetSearchActivitiesAndLocations()
  },
  watch: {
    searchTerm () {
      this.search()
    },
    searchLocation () {
      this.search()
    }
  },
  methods: {
    ...mapActions([
      'searchActivitiesAndLocations',
      'resetSearchActivitiesAndLocations'
    ]),
    search () {
      if (this.searchTerm || this.searchLocation) {
        const filters = pick(this, ['searchTerm', 'searchLocation'])
        this.searchActivitiesAndLocations(filters)
      }
    }
  }
}
</script>

