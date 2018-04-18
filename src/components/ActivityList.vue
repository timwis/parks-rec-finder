<template>
  <div>
    <div class="results">
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
.results
  top: 9rem
  overflow-y: auto
  position: absolute
  bottom: 0
  left: 0
  right: 0
ul
  padding: 1rem
</style>
