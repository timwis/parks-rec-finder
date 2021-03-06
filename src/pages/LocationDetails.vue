<template>
  <main class="location-detail-container">
    <aside
      v-if="isMapVisible"
      class="sidebar">
      <div
        v-if="isLoading"
        class="pam center">
        <FontAwesomeIcon
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
            <FontAwesomeIcon
              icon="map-marker-alt"
              size="4x"/>
          </div>
          <h2
            data-testid="name"
            class="cell">{{ name }}</h2>
        </div>
        <div class="location-detail-results-container">
          <DetailSection
            v-if="fullAddress"
            title="Location"
            icon="map-marker">
            <address>{{ fullAddress }}</address>
            <a
              :href="directionsUrl"
              class="external">
              Get directions
            </a>
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
            icon="user">
            <div class="detail">
              {{ siteContact }}
            </div>
          </DetailSection>

          <DetailSection
            v-if="schedules && schedules.length > 0"
            title="Regular hours"
            icon="clock-o">
            <table>
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
            {{ description }}
          </DetailSection>

          <DetailSection
            v-if="activities && activities.length > 0"
            :title="activities.length + ' activities offered here'"
            :is-indented="false"
            data-testid="activitiesCount"
            class="activities-count">
            <ActivityList :activities="activities"/>
          </DetailSection>
        </div>
      </div>
    </aside>
    <button
      class="button toggle-map hide-for-large"
      @click.prevent="toggleMap">
      Toggle map
    </button>
    <section class="map">
      <SiteMap
        v-if="$mq === 'lg' || !isMapVisible"
        :location-details="locationDetails"/>
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
      isMapVisible: true
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
      const encodedAddress = encodeURIComponent(this.fullAddress)
      return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
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
      this.isMapVisible = !this.isMapVisible
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
  padding: 1rem 1rem 0 1rem

.location-detail-results-container
  height: calc(100vh - 19rem)
  padding: 1rem
  overflow-y: scroll

@media screen and (max-width: 39.9375em)
  .fa-4x
    font-size: 2rem

</style>
