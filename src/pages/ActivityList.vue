<template>
  <main>
    <aside class="list">
      <h2>{{ categoryName }}</h2>
      <p>({{ count }})</p>

      <ActivityFilterControls v-model="currentFilters" />

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
    </aside>
    <section class="map">
      <SiteMap :activities="filteredActivities"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import SiteMap from '~/components/SiteMap'
import ActivityListItem from '~/components/ActivityListItem'
import ActivityFilterControls from '~/components/ActivityFilterControls'

export default {
  props: {
    categorySlug: String
  },
  components: {
    SiteMap,
    ActivityListItem,
    ActivityFilterControls
  },
  data () {
    return {
      currentFilters: {}
    }
  },
  computed: {
    ...mapState({
      activities: (state) => state.activities,
      categoryId: (state) => state.activityCategoryDetails.id,
      categoryName: (state) => state.activityCategoryDetails.name
    }),
    count () {
      return this.activities.length
    },
    filteredActivities () {
      const filterFunctions = []
      if (this.currentFilters.cost) {
        filterFunctions.push((activity) => {
          return activity.fee === '' || activity.fee === '0.00'
        })
      }
      if (this.currentFilters.gender) {
        const genderInitial = getGenderInitial(this.currentFilters.gender)
        filterFunctions.push((activity) => {
          return activity.gender === genderInitial || activity.gender === 'M/F'
        })
      }
      return this.activities.filter((activity) => {
        return filterFunctions.every((fn) => fn(activity))
      })
    }
  },
  created () {
    this.getActivitiesByCategorySlug(this.categorySlug)
  },
  destroyed () {
    this.resetActivityCategoryDetails()
    this.resetActivities()
  },
  watch: {
    categorySlug () {
      this.getActivitiesByCategorySlug(this.categorySlug)
    }
  },
  methods: {
    ...mapActions([
      'getActivitiesByCategorySlug'
    ]),
    ...mapMutations({
      resetActivityCategoryDetails: 'RESET_ACTIVITY_CATEGORY_DETAILS',
      resetActivities: 'RESET_ACTIVITIES'
    })
  }
}

const genderInitialsMap = { male: 'M', female: 'F' }
function getGenderInitial (gender) {
  return genderInitialsMap[gender]
}
</script>

