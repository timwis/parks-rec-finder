<template>
  <main>
    <aside class="list">
      <div class="panel-head">
        <div
          v-if="activeTab === 'activities'"
          class="activities">
          <section>
            <h2>Things to do</h2>
            <p>Choose a category from the list below to find an activity.</p>
          </section>
        </div>
        <div
          v-else-if="activeTab === 'locations'"
          class="locations">
          <section>
            <h2>Places to go</h2>
            <p>Choose a category from the list below to explore our locations.</p>
          </section>
        </div>

        <div v-if="isLoading">
          Loading...
        </div>
        <div v-else-if="error">
          Error: {{ error }}
        </div>
        <div v-else>
          <TabSwitcher :active-tab="activeTab">
            <router-link
              slot="activities"
              to="/activities">
              Activities ({{ activitiesCount }})
            </router-link>
            <router-link
              slot="locations"
              to="/locations">
              Locations ({{ locationsCount }})
            </router-link>
          </TabSwitcher>
        </div>
      </div>

      <div class="results">
        <ul
          v-if="activeTab === 'activities'"
          data-testid="activityCategories"
          class="no-bullet">
          <CategoryListItem
            v-for="category in activityCategories"
            :key="category.id"
            :name="category.name"
            :count="category.count"
            :photo="category.photo"
            :slug="category.slug"
            :description="category.description"
            url-prefix="activities"/>
        </ul>

        <ul
          v-if="activeTab === 'locations'"
          data-testid="locationCategories"
          class="no-bullet">
          <CategoryListItem
            v-for="category in locationCategories"
            :key="category.id"
            :name="category.name"
            :count="category.count"
            :photo="category.photo"
            :slug="category.slug"
            :description="category.description"
            url-prefix="locations"/>
        </ul>
      </div>
    </aside>

    <section class="map">
      <SiteMap/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import CategoryListItem from '~/components/CategoryListItem'
import TabSwitcher from '~/components/TabSwitcher'

export default {
  components: {
    SiteMap,
    CategoryListItem,
    TabSwitcher
  },
  props: {
    activeTab: {
      type: String, // activities or locations
      default: 'activities'
    }
  },
  data () {
    return {
      error: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState([
      'activityCategories',
      'locationCategories'
    ]),
    activitiesCount () {
      return this.activityCategories.reduce(categoryCountReducer, 0)
    },
    locationsCount () {
      return this.locationCategories.reduce(categoryCountReducer, 0)
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'getActivityCategories',
      'getLocationCategories'
    ]),
    async fetch () {
      this.error = null
      this.isLoading = true
      try {
        await Promise.all([
          this.getActivityCategories(),
          this.getLocationCategories()
        ])
      } catch (err) {
        this.error = err.message
        Raven.captureException(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}

function categoryCountReducer (accumulator, category) {
  return accumulator + category.count
}
</script>

<style lang="sass">

.panel-head
  position: fixed
  background: white
  width: inherit
  padding: 1rem
  height: 13rem
  z-index: 10
  h2
    font-weight: bold
    line-height: 1rem
  p
    margin-bottom: 4rem
.results
  overflow-y: auto
  position: absolute
  top: 13rem
  bottom: 0
  left: 0
  right: 0
</style>
