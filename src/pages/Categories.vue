<template>
  <div>

    <section v-if="activeTab === 'activities'">
      <h2>Things to do</h2>
      <p>Choose a category from the list below to find an activity.</p>
    </section>

    <section v-else-if="activeTab === 'locations'">
      <h2>Places to go</h2>
      <p>Choose a category from the list below to explore our locations.</p>
    </section>

    <ul>
      <li>
        <router-link to="/activities">Activities ({{ activitiesCount }})</router-link>
      </li>
      <li>
        <router-link to="/locations">Locations ({{ locationsCount }})</router-link>
      </li>
    </ul>

    <ul v-if="activeTab === 'activities'">
      <CategoryListItem
        v-for="category in activityCategories"
        :key="category.id"
        url-prefix="activities"
        :name="category.name"
        :count="category.count"
        :photo="category.photo"
      />
    </ul>

    <ul v-if="activeTab === 'locations'">
      <CategoryListItem
        v-for="category in locationCategories"
        :key="category.id"
        url-prefix="locations"
        :name="category.name"
        :count="category.count"
        :photo="category.photo"
      />
    </ul>

  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex'
import CategoryListItem from '~/components/CategoryListItem'

export default {
  name: 'Categories',
  props: {
    activeTab: String // programs or locations
  },
  components: {
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
