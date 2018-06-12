<template>
  <main class="activity-detail-container">
    <aside
      v-if="isSidebarVisible"
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
        <div class="panel-head activity-detail grid-x align-center">
          <h2
            class="cell"
            data-testid="name">{{ name }}</h2>
          <ul class="cell inline-list no-margin">
            <li v-if="ageRange">Age: {{ ageRange }}</li>
            <li v-if="gender">Gender: {{ gender }}</li>
            <li v-if="feeDescription">Cost: {{ feeDescription }}</li>
          </ul>
        </div>
        <div class="results-container">
          <div class="registration-status">
            <p v-if="registrationStatus">
              <b>Registration</b> - {{ registrationStatus }}
            </p>
            <p v-if="registrationLink">
              To sign up visit: <br>
              <a
                :href="registrationLink"
                class="external">
                {{ registrationLink }}
              </a>
            </p>
          </div>
          <DetailSection
            v-if="locationFullAddress"
            title="Location"
            icon="map-marker">
            <address>
              <router-link :to="locationUrl">
                {{ locationName }}
              </router-link>
              <br>
              {{ locationFullAddress }}
            </address>
            <router-link :to="locationUrl">
              View this location
            </router-link>
          </DetailSection>

          <DetailSection
            v-if="locationPhone"
            title="Contact"
            icon="phone">
            <a :href="locationPhoneLink">{{ locationPhone }}</a>
          </DetailSection>

          <DetailSection
            v-if="description"
            title="About this activity"
            icon="file-o">
            <p>{{ description }}</p>
          </DetailSection>

          <DetailSection
            v-if="schedules && schedules.length > 0"
            title="Program schedules"
            icon="calendar">
            <div
              v-for="schedule in schedules"
              :key="schedule.id">
              <b>Start Date:</b> {{ schedule.date_from | formatDate }}<br>
              <b>End Date:</b> {{ schedule.date_to | formatDate }}
              <table>
                <tr
                  v-for="day in schedule.days"
                  :key="day.id">
                  <td>{{ day }}</td>
                  <td>{{ schedule.time_from | formatTime }} - {{ schedule.time_to | formatTime }}</td>
                </tr>
              </table>
            </div>
          </DetailSection>

          <DetailSection
            v-if="registrationStatus || registrationLink || locationPhone"
            title="Registration information"
            icon="info-circle">
            <p>To sign up or learn more, use the contact information above.</p>
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
        v-if="$mq == 'lg' || !isSidebarVisible"
        :activity-details="activityDetails"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import DetailSection from '~/components/DetailSection'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import {
  concatAddress,
  getAgeRange,
  getFeeDescription,
  formatPhone,
  formatDate,
  formatTime,
  formatDaysList
} from '~/util'

export default {
  components: {
    SiteMap,
    DetailSection,
    FontAwesomeIcon
  },
  filters: {
    formatDate,
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
      activityDetails: (state) => state.activityDetails,
      name: (state) => state.activityDetails.name,
      description: (state) => state.activityDetails.description,
      gender: (state) => state.activityDetails.gender,
      ageRange: (state) => getAgeRange(state.activityDetails.ageLow, state.activityDetails.ageHigh),
      feeDescription: (state) => getFeeDescription(state.activityDetails.fee, state.activityDetails.feeFrequency),
      registrationStatus: (state) => state.activityDetails.registrationStatus,
      registrationLink: (state) => state.activityDetails.registrationLink,
      locationId: (state) => state.activityDetails.locationId,
      locationName: (state) => state.activityDetails.locationName,
      locationFullAddress: (state) => concatAddress(state.activityDetails.locationAddress),
      locationPhone: (state) => formatPhone(state.activityDetails.locationPhone),
      locationPhoneLink: (state) => `tel:+1` + state.activityDetails.locationPhone,
      schedules: (state) => state.activityDetails.schedules
    }),
    locationUrl () {
      return `/location/${this.locationId}`
    }
  },
  watch: {
    id: 'fetch'
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetActivityDetails()
  },
  methods: {
    ...mapActions([
      'getActivityDetails',
      'resetActivityDetails'
    ]),
    async fetch () {
      this.error = null
      this.isLoading = true
      try {
        await this.getActivityDetails(this.id)
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
<style lang="sass">
.panel-head.activity-detail
  +fixed-header($activities)
  text-align: center
  padding: 1rem

  @media screen and (max-width: 39.9375em)
    padding: 5px

  h2
    font-weight: bold
    @media screen and (max-width: 39.9375em)
      padding: 0
      font-size: 1.2rem
      margin: .7rem 0

  ul li
    padding-right: 1rem
    font-size: .9rem

.registration-status
  padding: 1rem
  text-align: center

  @media screen and (max-width: 39.9375em)
    padding: 0
</style>
