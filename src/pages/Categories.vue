<template>
  <main>
    <aside class="list">
      <section v-if="activeTab === 'activities'">
        <h2>Things to do</h2>
        <p>Choose a category from the list below to find an activity.</p>
      </section>

      <section v-else-if="activeTab === 'locations'">
        <h2>Places to go</h2>
        <p>Choose a category from the list below to explore our locations.</p>
      </section>

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

        <ul v-if="activeTab === 'activities'" data-testid="activityCategories">
          <CategoryListItem
            v-for="category in activityCategories"
            :key="category.id"
            :name="category.name"
            :count="category.count"
            :photo="category.photo"
            url-prefix="activities"
            :slug="category.slug"
          />
        </ul>

        <ul v-if="activeTab === 'locations'" data-testid="locationCategories">
          <CategoryListItem
            v-for="category in locationCategories"
            :key="category.id"
            :name="category.name"
            :count="category.count"
            :photo="category.photo"
            url-prefix="locations"
            :slug="category.slug"
          />
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
import SiteMap from '~/components/SiteMap'
import CategoryListItem from '~/components/CategoryListItem'
import TabSwitcher from '~/components/TabSwitcher'

export default {
  name: 'Categories',
  props: {
    activeTab: String // activities or locations
  },
  components: {
    SiteMap,
    CategoryListItem,
    TabSwitcher
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
