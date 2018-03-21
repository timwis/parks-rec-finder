<template>
  <div>
    <h2>Search results</h2>
    <p>
      Showing {{ count }} results
      for {{ term }}
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    term: String
  },
  computed: {
    ...mapState([
      'activities',
      'locations'
    ]),
    count () {
      return this.activities.length + this.locations.length
    }
  },
  created () {
    const term = this.term
    if (!term) {
      this.$router.push('/')
      return
    }
    this.getActivities({ term })
    this.getLocations({ term })
  },
  methods: mapActions([
    'getActivities',
    'getLocations'
  ])
}
</script>

