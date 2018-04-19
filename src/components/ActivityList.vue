<template>
  <div>
    <div class="cell medium-cell-block-y medium-cell-block-container results-container">
      <ul class="no-bullet">
        <ActivityListItem
          v-for="activity in activities"
          :key="activity.id"
          :id="activity.id"
          :name="activity.name"
          :slug="activity.slug"
          :fee="activity.fee"
          :fee-frequency="activity.feeFrequency"
          :gender="activity.gender"
          :age-low="activity.ageLow"
          :age-high="activity.ageHigh"
          :location-name="activity.locationName"
          :location-address="activity.locationAddress"
          data-testid="activityListItem"/>
      </ul>
    </div>
  </div>
</template>

<script>
import ActivityListItem from '~/components/ActivityListItem'

export default {
  components: {
    ActivityListItem
  },
  props: {
    activities: {
      type: Array,
      required: true
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
