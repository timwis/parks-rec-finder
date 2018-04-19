<template>
  <main class="activity-detail-container">
    <aside class="sidebar">
      <div v-if="isLoading">
        Loading...
      </div>
      <div
        v-else-if="error"
        data-testid="error">
        Error: {{ error }}
      </div>
      <div v-else>
        <div class="panel-head activity-detail grid-x align-center">
          <h2 data-testid="name">{{ name }}</h2>
          <ul class="inline-list">
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
              To sign up visit
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
            <div class="detail">
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
            </div>
          </DetailSection>

          <DetailSection
            v-if="locationPhone"
            title="Contact"
            icon="phone">
            <div class="detail">
              <a :href="locationPhoneLink">{{ locationPhone }}</a>
            </div>
          </DetailSection>

          <DetailSection
            v-if="description"
            title="About this activity"
            icon="file-o">
            <div class="detail">
              <p>{{ description }}</p>
            </div>
          </DetailSection>

          <DetailSection
            v-if="schedules && schedules.length > 0"
            title="Program schedules"
            icon="calendar">
            <div class="detail">
              <ul
                v-for="schedule in schedules"
                :key="schedule.id">
                <li>
                  Between
                  <time :datetime="schedule.date_from">
                    {{ schedule.date_from | formatDate }}
                  </time>
                  and
                  <time :datetime="schedule.date_to">
                    {{ schedule.date_to | formatDate }}
                  </time>
                  on
                  {{ schedule.days | formatDaysList }}
                  from
                  <time>{{ schedule.time_from | formatTime }}</time>
                  to
                  <time>{{ schedule.time_to | formatTime }}</time>
                </li>
              </ul>
            </div>
          </DetailSection>

          <DetailSection
            v-if="registrationStatus || registrationLink || locationPhone"
            title="Registration information"
            icon="info-circle">
            <div class="detail">
              <p>To sign up or learn more, use the contact information above.
              </p>
            </div>
          </DetailSection>
        </div>
      </div>
    </aside>
    <section class="map">
      <SiteMap :activity-details="activityDetails"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import DetailSection from '~/components/DetailSection'
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
    DetailSection
  },
  filters: {
    formatDate,
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
  h2
    font-weight: bold
    padding: 1rem 0
  ul li
    padding-right: 1rem
.detail
  margin-left: 2rem
.registration-status
  padding: 1rem
  text-align: center
</style>
