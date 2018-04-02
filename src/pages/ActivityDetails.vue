<template>
  <main>
    <aside class="list">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        Error: {{ error }}
      </div>
      <div v-else>
        <h2>{{ name }}</h2>

        <ul>
          <li v-if="ageRange">Age: {{ ageRange }}</li>
          <li v-if="gender">Gender: {{ gender }}</li>
          <li v-if="feeDescription">Cost: {{ feeDescription }}</li>
        </ul>

        <DetailSection
          v-if="facilityFullAddress"
          title="Location"
          icon="map-marker"
        >
          <address>
            <router-link :to="locationUrl">
              {{ facilityName }}
            </router-link>
            <br>
            {{ facilityFullAddress }}
          </address>
          <router-link :to="locationUrl">
            View this location
          </router-link>
        </DetailSection>

        <DetailSection
          v-if="facilityPhone"
          title="Contact"
          icon="phone"
        >
          <a :href="facilityPhoneLink">{{ facilityPhone }}</a>
        </DetailSection>

        <DetailSection
          v-if="description"
          title="About this activity"
          icon="file-o"
        >
          <p>{{ description }}</p>
        </DetailSection>

        <DetailSection
          v-if="schedules && schedules.length > 0"
          title="Schedules"
          icon="calendar"
        >
          <ul v-for="schedule in schedules" :key="schedule.id">
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
        </DetailSection>

        <DetailSection
          v-if="registrationStatus || registrationLink || facilityPhone"
          title="Registration"
          icon="info-circle"
        >
          <p v-if="registrationStatus">
            Status: <em>{{ registrationStatus }}</em>
          </p>
          <p v-if="registrationLink">
            To sign up visit
            <a :href="registrationLink" class="external">{{ registrationLink }}</a>
          </p>
          <p v-else>
            To sign up or learn more, use the contact information listed above!
          </p>
        </DetailSection>
      </div>
    </aside>
    <section class="map">
      <SiteMap :activity-details="activityDetails"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      facilityId: (state) => state.activityDetails.facilityId,
      facilityName: (state) => state.activityDetails.facilityName,
      facilityFullAddress: (state) => concatAddress(state.activityDetails.facilityAddress),
      facilityPhone: (state) => formatPhone(state.activityDetails.facilityPhone),
      facilityPhoneLink: (state) => `tel:+1` + state.activityDetails.facilityPhone,
      schedules: (state) => state.activityDetails.schedules
    }),
    locationUrl () {
      return `/location/${this.facilityId}`
    }
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetActivityDetails()
  },
  watch: {
    id: 'fetch'
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
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
