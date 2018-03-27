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
import { mapState, mapActions } from 'vuex'
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
      return this.filteredActivities.length
    },
    filteredActivities () {
      const filterFunctions = []
      const currentFilters = this.currentFilters
      if (currentFilters.cost) {
        filterFunctions.push((activity) => {
          return activity.fee === '' || activity.fee === '0.00'
        })
      }
      if (currentFilters.age) {
        const [filterLow, filterHigh] = currentFilters.age.split('-')
        filterFunctions.push((activity) => {
          return (!filterHigh || activity.ageLow <= filterHigh) &&
            (!filterLow || activity.ageHigh >= filterLow)
        })
      }
      if (currentFilters.gender) {
        const genderInitial = getGenderInitial(currentFilters.gender)
        filterFunctions.push((activity) => {
          return activity.gender === genderInitial || activity.gender === 'M/F'
        })
      }
      if (currentFilters.days && currentFilters.days.length > 0) {
        filterFunctions.push((activity) => {
          return currentFilters.days.some((day) => {
            return activity.schedules && activity.schedules.some((schedule) => {
              return schedule.days && schedule.days.includes(day)
            })
          })
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
    this.resetActivitiesByCategorySlug()
  },
  watch: {
    categorySlug () {
      this.getActivitiesByCategorySlug(this.categorySlug)
    }
  },
  methods: mapActions([
    'getActivitiesByCategorySlug',
    'resetActivitiesByCategorySlug'
  ])
}

const genderInitialsMap = { male: 'M', female: 'F' }
function getGenderInitial (gender) {
  return genderInitialsMap[gender]
}
</script>

