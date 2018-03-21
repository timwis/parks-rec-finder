<template>
  <div>
    <h2>Search results</h2>
    <p>
      Showing {{ count }} results
      for {{ term }}
    </p>

    <ul>
      <li>
        <router-link :to="{ path: '/search/activities', query: { term } }">
          Activities ({{ activities.length }})
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: '/search/locations', query: { term } }">
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
import ActivityListItem from '~/components/ActivityListItem'
import LocationListItem from '~/components/LocationListItem'

export default {
  props: {
    activeTab: {
      type: String, // activities or programs
      default: 'activities'
    },
    term: String
  },
  components: {
    ActivityListItem,
    LocationListItem
  },
  computed: {
    ...mapState([
      'activities',
      'locations'
    ]),
    count () {
      return this.activities.length + this.locations.length
    }
  },
  created () {
    const term = this.term
    if (!term) {
      this.$router.push('/')
      return
    }
    this.getActivities({ term })
    this.getLocations({ term })
  },
  destroyed () {
    this.resetActivities()
    this.resetLocations()
  },
  watch: {
    term () {
      const term = this.term
      this.getActivities({ term })
      this.getLocations({ term })
    }
  },
  methods: {
    ...mapActions([
      'getActivities',
      'getLocations'
    ]),
    ...mapMutations({
      'resetActivities': 'RESET_ACTIVITIES',
      'resetLocations': 'RESET_LOCATIONS'
    })
  }
}
</script>

