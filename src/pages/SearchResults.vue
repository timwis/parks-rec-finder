<template>
  <div>
    <h2>Search results</h2>
    <p>
      Showing {{ count }} results
      for {{ searchTerm }}
    </p>

    <ul>
      <li>
        <router-link :to="{ path: '/search/activities', query }">
          Activities ({{ activities.length }})
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: '/search/locations', query }">
          Locations ({{ locations.length }})
        </router-link>
      </li>
    </ul>

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
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import pick from 'lodash/pick'
import ActivityListItem from '~/components/ActivityListItem'
import LocationListItem from '~/components/LocationListItem'

export default {
  props: {
    activeTab: {
      type: String, // activities or programs
      default: 'activities'
    },
    searchTerm: String,
    searchLocation: String
  },
  components: {
    ActivityListItem,
    LocationListItem
  },
  computed: {
    ...mapState([
      'activities',
      'locations',
      'searchLocationGeometry'
    ]),
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
    this.resetActivities()
    this.resetLocations()
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
      'searchActivitiesAndLocations'
    ]),
    ...mapMutations({
      'resetActivities': 'RESET_ACTIVITIES',
      'resetLocations': 'RESET_LOCATIONS'
    }),
    search () {
      if (this.searchTerm || this.searchLocation) {
        const filters = pick(this, ['searchTerm', 'searchLocation'])
        this.searchActivitiesAndLocations(filters)
      }
    }
  }
}
</script>

