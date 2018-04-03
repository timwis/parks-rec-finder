<template>
  <div id="application" class="grid-y medium-grid-frame">
    <SiteHeader
      class="cell"
      :search-term="searchTerm"
      :search-location="searchLocation"
      @search="onSearch"
    />
    <router-view class="cell auto"/>
  </div>
</template>


<script>
import SiteHeader from './components/SiteHeader'
import SiteMap from '~/components/SiteMap'

export default {
  name: 'app',
  components: {
    SiteHeader
  },
  computed: {
    searchTerm () {
      return this.$route.query.term || this.$route.query.freetext // backwards compatability w/1.0
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
        path: '/search/activities',
        query
      })
    }
  }
}
</script>

<style lang="sass">
$fa-font-path: "~font-awesome/fonts"
@import "~font-awesome/scss/font-awesome"
@import "~phila-standards/src/sass/phila-app"

main
  @include xy-grid(horizontal)

  .list
    @include xy-cell(8)
    @include xy-cell-block(true)

  .map
    @include xy-cell(16, false, 0)
</style>
