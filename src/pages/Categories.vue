<template>
  <main>
    <aside
      v-if="isMapVisible"
      class="sidebar">
      <div class="grid-y medium-grid-frame">
        <div class="panel-head grid-x">
          <div
            v-if="activeTab === 'activities'"
            class="activities cell">
            <section>
              <h2>Things to do</h2>
              <p>Choose a category from the list below to find an activity.</p>
            </section>
          </div>
          <div
            v-else-if="activeTab === 'locations'"
            class="locations cell">
            <section>
              <h2>Places to go</h2>
              <p>Choose a category from the list below to explore our locations.</p>
            </section>
          </div>

          <div
            v-if="isLoading"
            class="pam center">
            <FontAwesomeIcon
              icon="spinner"
              spin
              size="lg"/>
          </div>
          <div
            v-else-if="error"
            data-testid="error"
            class="pam">
            <b>Error:</b> {{ error }}
          </div>
          <div
            v-else
            class="cell">
            <TabSwitcher :active-tab="activeTab">
              <router-link
                slot="activities"
                to="/activities">
                Activities
              </router-link>
              <router-link
                slot="locations"
                to="/locations">
                Locations
              </router-link>
            </TabSwitcher>
          </div>
        </div>

        <div class="cell medium-cell-block-y medium-cell-block-container results-container">
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
      </div>
    </aside>

    <section class="map">
      <SiteMap
        v-if="$mq === 'lg' || !isMapVisible"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Raven from 'raven-js'
import SiteMap from '~/components/SiteMap'
import CategoryListItem from '~/components/CategoryListItem'
import TabSwitcher from '~/components/TabSwitcher'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  components: {
    SiteMap,
    CategoryListItem,
    TabSwitcher,
    FontAwesomeIcon
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
      isLoading: false,
      isMapVisible: true
    }
  },
  computed: mapState([
    'activityCategories',
    'locationCategories'
  ]),
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
</script>

<style lang="sass" scoped>
.panel-head
  +fixed-header(white)
  color: #444
  padding: 1rem

  @media screen and (max-width: 39.9375em)
    padding: .5rem 1rem

  h2
    font-weight: bold
    line-height: 1rem
</style>
