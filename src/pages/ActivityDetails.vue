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

        <div v-if="schedules && schedules.length > 0">
          <h4>Schedules</h4>
          <div v-for="schedule in schedules" :key="schedule.id">
            <dl>
              <dt>Start date:</dt>
              <dd>{{ schedule.date_from }}</dd>

              <dt>End date:</dt>
              <dd>{{ schedule.date_to }}</dd>

              <dt>Start time:</dt>
              <dd>{{ schedule.time_from }}</dd>

              <dt>End time:</dt>
              <dd>{{ schedule.time_to }}</dd>

              <dt>Days:</dt>
              <dd>{{ schedule.days.join(', ') }}</dd>
            </dl>
          </div>
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
import SiteMap from '~/components/SiteMap'
import { concatAddress } from '~/util'

export default {
  props: {
    id: String
  },
  components: {
    SiteMap
  },
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      activityDetails: (state) => state.activityDetails,
      name: (state) => state.activityDetails.name,
      schedules: (state) => state.activityDetails.schedules
    })
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
