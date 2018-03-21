<template>
  <div>
    <h2>{{ activityCategoryDetails.name }}</h2>
    <p>({{ count }})</p>

    <ul>
      <ActivityListItem
        v-for="activity in activities"
        :key="activity.id"
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
    category: String
  },
  components: {
    ActivityListItem
  },
  computed: {
    ...mapState([
      'activities',
      'activityCategoryDetails'
    ]),
    count () {
      return this.activities.length
    }
  },
  created () {
    this.getActivities({ category: this.category })
  },
  destroyed () {
    this.resetActivities()
  },
  watch: {
    category (newCategory) {
      this.getActivities({ category: newCategory })
    }
  },
  methods: {
    ...mapActions([
      'getActivities'
    ]),
    ...mapMutations({
      resetActivities: 'RESET_ACTIVITIES'
    })
  }
}
</script>

