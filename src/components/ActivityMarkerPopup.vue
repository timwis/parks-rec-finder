<template>
  <LPopup>
    <h3>{{ locationName }}</h3>
    <ul>
      <li
        v-for="activity in activities"
        :key="activity.id">
        <router-link :to="`/activity/${activity.slug}/${activity.id}`">
          {{ activity.name }}
        </router-link>
      </li>
    </ul>
  </LPopup>
</template>

<script>
import { LPopup } from 'vue2-leaflet'

export default {
  components: {
    LPopup
  },
  props: {
    locationName: {
      type: String,
      required: true
    },
    activities: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
ul
  max-height: 150px
  overflow-y: auto
</style>
