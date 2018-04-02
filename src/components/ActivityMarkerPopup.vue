<template>
  <LPopup>
    <h3>{{ facilityName }}</h3>
    <ul>
      <li v-for="activity in activities" :key="activity.id">
        <router-link :to="`/activity/${activity.id}`">
          {{ activity.name }}
        </router-link>
      </li>
    </ul>
  </LPopup>
</template>

<script>
import { LPopup } from 'vue2-leaflet'

export default {
  props: {
    facilityName: String,
    activities: Array
  },
  components: {
    LPopup
  }
}
</script>
