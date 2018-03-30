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

        <ActivityList
          :activities="filteredActivities"
          :current-filters="currentFilters"
          @filter="setFilters"
        />
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
import ActivityList from '~/components/ActivityList'

export default {
  components: {
    SiteMap,
    ActivityList
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

