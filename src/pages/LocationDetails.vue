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

        <DetailSection
          v v-if="fullAddress"
          title="Location"
          icon="map-marker"
        >
          <address>{{ fullAddress }}</address>
          <p><a :href="directionsUrl" class="external">Get directions</a></p>
        </DetailSection>

        <DetailSection
          v-if="phone"
          title="Contact"
          icon="phone"
        >
          <a :href="phoneLink">{{ phone }}</a>
        </DetailSection>

        <DetailSection
          v-if="siteContact"
          title="Site contact"
          icon="person"
        >
          {{ siteContact }}
        </DetailSection>

        <DetailSection
          v-if="schedules && schedules.length > 0"
          title="Regular hours"
          icon="clock-o"
        >
          <ul v-for="schedule in schedules" :key="schedule.id">
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
          icon="file-o"
        >
          <p>{{ description }}</p>
        </DetailSection>
      </div>
    </aside>
    <section class="map">
      <SiteMap :location-details="locationDetails"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteMap from '~/components/SiteMap'
import DetailSection from '~/components/DetailSection'
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
    DetailSection
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
      schedules: (state) => sortByFirstDay(state.locationDetails.schedules)
    }),
    directionsUrl () {
      return `https://www.google.com/maps/dir/?api=1&query=${this.fullAddress}`
    }
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetLocationDetails()
  },
  watch: {
    id: 'fetch'
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
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
