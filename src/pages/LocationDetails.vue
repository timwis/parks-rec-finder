<template>
  <main class="location-detail-container">
    <aside
      v-if="isSidebarVisible"
      class="sidebar">
      <div
        v-if="isLoading"
        class="pam center">
        <font-awesome-icon
          icon="spinner"
          spin
          size="3x"/>
      </div>
      <div
        v-else-if="error"
        data-testid="error"
        class="pam">
        <b>Error:</b> {{ error }}
      </div>
      <div
        v-else
        class="grid-y medium-grid-frame">
        <div class="panel-head location-detail cell shrink medium-cell-block-container align-center grid-x">
          <div class="cell">
            <font-awesome-icon
              icon="faMapMarkerAlt"
              size="4x"/>
          </div>
          <h2
            data-testid="name"
            class="cell">{{ name }}</h2>
        </div>
        <div class="results-container">
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
            <div class="detail">
              <a :href="phoneLink">{{ phone }}</a>
            </div>
          </DetailSection>

          <!-- <DetailSection
            v-if="siteContact"
            title="Site contact"
            icon="user">
            <div class="detail">
              {{ siteContact }}
            </div>
          </DetailSection> -->

          <DetailSection
            v-if="schedules && schedules.length > 0"
            title="Regular hours"
            icon="clock-o">
            <table class="detail">
              <tr
                v-for="schedule in schedules"
                :key="schedule.id">
                <td>
                  {{ schedule.days | formatDaysList }}
                </td>
                <td>
                  <time>{{ schedule.time_from | formatTime }}</time> -
                  <time>{{ schedule.time_to | formatTime }}</time>
                </td>
              </tr>
            </table>
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
            data-testid="activitiesCount"
            class="activities-count">
            <ActivityList :activities="activities"/>
          </DetailSection>
        </div>
      </div>
    </aside>
    <button
      class="button toggleMap hide-for-large"
      @click.prevent="toggleMap">
      Toggle map</button>
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
      isLoading: false,
      isSidebarVisible: true
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
    },
    toggleMap () {
      this.isSidebarVisible = !this.isSidebarVisible
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
  text-align: center
  padding: 1rem
.detail
  margin: 0 1rem 0 2rem

</style>
