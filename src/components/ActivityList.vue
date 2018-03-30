<template>
  <div>
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
