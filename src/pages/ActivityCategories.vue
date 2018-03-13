<template lang="pug">
  div
    ul
      li(v-for='category in activityCategories') {{ category.activityTypeCategory }}
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ActivityCategories',
  computed: mapState([
    'activityCategories'
  ]),
  created () {
    this.getActivityCategories()
  },
  methods: mapActions([
    'getActivityCategories'
  ])
}
</script>
