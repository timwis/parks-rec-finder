<template>
  <div>
    <h2>{{ categoryName }}</h2>
    <p>({{ count }})</p>

    <ul>
      <ActivityListItem
        v-for="activity in activities"
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ActivityListItem from '~/components/ActivityListItem'

export default {
  props: {
    categorySlug: String
  },
  components: {
    ActivityListItem
  },
  computed: {
    ...mapState({
      activities: (state) => state.activities,
      categoryId: (state) => state.activityCategoryDetails.id,
      categoryName: (state) => state.activityCategoryDetails.name
    }),
    count () {
      return this.activities.length
    }
  },
  async created () {
    await this.getActivityCategoryDetails(this.categorySlug)
    this.getActivities({ categoryId: this.categoryId })
  },
  destroyed () {
    this.resetActivityCategoryDetails()
    this.resetActivities()
  },
  watch: {
    async categorySlug () {
      await this.getActivityCategoryDetails(this.categorySlug)
      this.getActivities({ categoryId: this.categoryId })
    }
  },
  methods: {
    ...mapActions([
      'getActivityCategoryDetails',
      'getActivities'
    ]),
    ...mapMutations({
      resetActivityCategoryDetails: 'RESET_ACTIVITY_CATEGORY_DETAILS',
      resetActivities: 'RESET_ACTIVITIES'
    })
  }
}
</script>

