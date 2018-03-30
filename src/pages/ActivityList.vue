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
        <h2>{{ categoryName }}</h2>
        <p>({{ count }})</p>

        <ActivityFilterControls
          :current-filters="currentFilters"
          @change="setFilters"
        />

        <ul>
          <ActivityListItem
            v-for="activity in filteredActivities"
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
      </div>
    </aside>
    <section class="map">
      <SiteMap :activities="filteredActivities"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SiteMap from '~/components/SiteMap'
import ActivityListItem from '~/components/ActivityListItem'
import ActivityFilterControls from '~/components/ActivityFilterControls'

export default {
  components: {
    SiteMap,
    ActivityListItem,
    ActivityFilterControls
  },
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      categorySlug: (state) => state.route.params.categorySlug,
      activities: (state) => state.activities,
      categoryId: (state) => state.activityCategoryDetails.id,
      categoryName: (state) => state.activityCategoryDetails.name
    }),
    ...mapGetters([
      'currentFilters',
      'filteredActivities'
    ]),
    count () {
      return this.filteredActivities.length
    }
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetActivitiesByCategorySlug()
  },
  watch: {
    categorySlug: 'fetch'
  },
  methods: {
    ...mapActions([
      'getActivitiesByCategorySlug',
      'resetActivitiesByCategorySlug',
      'setFilters'
    ]),
    async fetch () {
      this.error = null
      this.isLoading = true
      try {
        await this.getActivitiesByCategorySlug(this.categorySlug)
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

