<template>
  <div id="application">
    <SiteHeader
      :search-term="searchTerm"
      :search-location="searchLocation"
      @search="onSearch"
    />
    <router-view/>
  </div>
</template>


<script>
import 'phila-standards/dist/css/phila-app.min.css'

import SiteHeader from './components/SiteHeader'
import SiteMap from '~/components/SiteMap'

export default {
  name: 'app',
  components: {
    SiteHeader
  },
  computed: {
    searchTerm () {
      return this.$route.query.term
    },
    searchLocation () {
      return this.$route.query.location
    }
  },
  methods: {
    onSearch ({ searchTerm, searchLocation }) {
      const query = {}
      if (searchTerm) query.term = searchTerm
      if (searchLocation) query.location = searchLocation
      this.$router.push({
        name: 'activitiesSearchResults',
        query
      })
    }
  }
}
</script>

<style lang="sass">
main
  display: grid
  grid-template-columns: minmax(300px, 3fr) 9fr
  grid-template-rows: calc(100vh - 73px)
  grid-template-areas: "list map"

  .list
    grid-area: list
    overflow-y: auto
    padding: 0 10px

  .map
    grid-area: map
</style>
