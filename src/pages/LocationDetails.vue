<template>
  <main>
    <aside class="list">
      <div v-if="isLoading">
        Loading...
      </div>
      <div
        v-else-if="error"
        data-testid="error">
        Error: {{ error }}
      </div>
      <div v-else>
        <div class="panel-head location-detail">
          <font-awesome-icon
            :icon="icon"
            size="4x"/>
          <h2 data-testid="name">{{ name }}</h2>
        </div>
        <div class="results">
          <DetailSection
            v-if="fullAddress"
            title="Location"
            icon="map-marker">
            <div class="detail">
              <address>{{ fullAddress }}</address>
            </div>
            <div class="detail">
              <a
                :href="directionsUrl"
                class="external">
                Get directions
              </a>
            </div>
          </DetailSection>

          <DetailSection
            v-if="phone"
            title="Contact"
            icon="phone">
            <a :href="phoneLink">{{ phone }}</a>
          </DetailSection>

          <DetailSection
            v-if="siteContact"
            title="Site contact"
            icon="person">
            <div class="detail">
              {{ siteContact }}
            </div>
          </DetailSection>

          <DetailSection
            v-if="schedules && schedules.length > 0"
            title="Regular hours"
            icon="clock-o">
            <ul
              v-for="schedule in schedules"
              :key="schedule.id">
              <li>
                {{ schedule.days | formatDaysList }}
                from
                <time>{{ schedule.time_from | formatTime }}</time>
                to
                <time>{{ schedule.time_to | formatTime }}</time>
              </li>
            </ul>
          </DetailSection>

          <DetailSection
            v-if="description"
            title="About this location"
            icon="file-o">
            <div class="detail">{{ description }}</div>
          </DetailSection>

          <DetailSection
            v-if="activities && activities.length > 0"
            :title="activities.length + ' activities offered here'"
            data-testid="activitiesCount">
            <ActivityList :activities="activities"/>
          </DetailSection>
        </div>
      </div>
    </aside>
    <section class="map">
      <SiteMap :location-details="locationDetails"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import DetailSection from '~/components/DetailSection'
import ActivityList from '~/components/ActivityList'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'
import {
  concatAddress,
  formatPhone,
  formatTime,
  formatDaysList,
  sortByFirstDay
} from '~/util'

export default {
  components: {
    SiteMap,
    DetailSection,
    ActivityList,
    FontAwesomeIcon
  },
  filters: {
    formatTime,
    formatDaysList
  },
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      id: (state) => state.route.params.id,
      locationDetails: (state) => state.locationDetails,
      name: (state) => state.locationDetails.name,
      description: (state) => state.locationDetails.description,
      fullAddress: (state) => concatAddress(state.locationDetails.address),
      phone: (state) => formatPhone(state.locationDetails.phone),
      phoneLink: (state) => `tel:+1` + state.locationDetails.phone,
      siteContact: (state) => state.locationDetails.siteContact,
      schedules: (state) => sortByFirstDay(state.locationDetails.schedules),
      activities: (state) => state.locationDetails.activities
    }),
    directionsUrl () {
      return `https://www.google.com/maps/dir/?api=1&query=${this.fullAddress}`
    },
    icon () {
      return faMapMarkerAlt
    }
  },
  watch: {
    id: 'fetch'
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetLocationDetails()
  },
  methods: {
    ...mapActions([
      'getLocationDetails',
      'resetLocationDetails'
    ]),
    async fetch () {
      this.error = null
      this.isLoading = true
      try {
        await this.getLocationDetails(this.id)
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
      title: this.name
    }
  }
}
</script>
<style lang="sass" scoped>
.location-detail
  +fixed-header($locations)
  color: white
  text-align: center
  padding: 1rem
.detail
  margin-left: 2rem
.results
  padding: 1rem
  .results
    position: relative
    top: 0
</style>
