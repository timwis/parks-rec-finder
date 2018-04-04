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
          @change="setFilters"/>

        <ActivityList :activities="filteredActivities"/>
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
import ActivityFilterControls from '~/components/ActivityFilterControls'
import ActivityList from '~/components/ActivityList'

export default {
  components: {
    SiteMap,
    ActivityFilterControls,
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
  watch: {
    categorySlug: 'fetch'
  },
  created () {
    this.fetch()
  },
  destroyed () {
    this.resetActivitiesByCategorySlug()
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
  },
  metaInfo () {
    return {
      title: `${this.categoryName} Activities`
    }
  }
}
</script>
