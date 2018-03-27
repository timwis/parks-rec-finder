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

      <ul class="tab-switcher">
        <li :class="{'is-active': activeTab === 'activities'}">
          <router-link to="/activities">Activities ({{ activitiesCount }})</router-link>
        </li>
        <li :class="{'is-active': activeTab === 'locations'}">
          <router-link to="/locations">Locations ({{ locationsCount }})</router-link>
        </li>
      </ul>

      <ul v-if="activeTab === 'activities'">
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

      <ul v-if="activeTab === 'locations'">
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

export default {
  name: 'Categories',
  props: {
    activeTab: String // programs or locations
  },
  components: {
    SiteMap,
    CategoryListItem
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
    this.getActivityCategories()
    this.getLocationCategories()
  },
  methods: mapActions([
    'getActivityCategories',
    'getLocationCategories'
  ])
}

function categoryCountReducer (accumulator, category) {
  return accumulator + category.count
}
</script>

<style lang="sass" scoped>
.tab-switcher
  margin-left: 0

  li
    display: inline

    a
      font-weight: normal
      padding-bottom: 5px

  li.is-active
    a
      font-weight: bold
      border-bottom: 2px #0f4d90 solid

  li:not(:first-child):before
    content: " | "
</style>

