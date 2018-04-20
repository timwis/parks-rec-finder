<template>
  <main>
    <aside class="sidebar">
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        Error: {{ error }}
      </div>
      <div v-else
        class="grid-y medium-grid-frame">
        <div class="panel-head activities cell shrink medium-cell-block-container grid-x">
          <h2
            data-testid="categoryName"
            class="cell">{{ categoryName }}</h2>
          <ItemCount
            :count="count" />
          <ActivityFilterControls
            :current-filters="currentFilters"
            @change="setFilters"/>
        </div>

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
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import ActivityFilterControls from '~/components/ActivityFilterControls'
import ActivityList from '~/components/ActivityList'
import ItemCount from '~/components/ItemCount'

export default {
  components: {
    SiteMap,
    ActivityFilterControls,
    ActivityList,
    ItemCount
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
        Raven.captureException(err)
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

<style lang="sass" scoped>
.panel-head.activities
  +fixed-header($activities)
  color: white
h2
  padding: 0 1rem
</style>
