<template>
  <div>
    <ul>
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
      />
    </ul>
  </div>
</template>

<script>
import ActivityListItem from '~/components/ActivityListItem'

export default {
  props: {
    activities: Array
  },
  components: {
    ActivityListItem
  }
}
</script>
