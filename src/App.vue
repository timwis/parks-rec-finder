<template>
  <div
    id="application"
    class="grid-y medium-grid-frame">
    <SiteHeader
      :search-term="searchTerm"
      :search-location="searchLocation"
      class="cell"
      @search="onSearch"/>
    <router-view class="cell auto"/>
    <SiteFooter/>
  </div>
</template>

<script>
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import fontawesome from '@fortawesome/fontawesome'
import { faMapMarkerAlt, faSpinner, faFilter, faPlus, faMinus, faTimes, faPhone, faImage } from '@fortawesome/fontawesome-free-solid/'

fontawesome.library.add(faSpinner, faMapMarkerAlt, faFilter, faPlus, faMinus, faTimes, faPhone, faImage)

export default {
  components: {
    SiteHeader,
    SiteFooter
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
  },
  metaInfo: {
    titleTemplate: (title) => {
      const appTitle = 'Philadelphia Parks & Recreation Finder'
      return title ? `${title} | ${appTitle}` : appTitle
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

  .sidebar
    min-height: 100vh
    position: fixed
    background: white
    z-index: 15000
    @include xy-cell(24, false)
    width: 100%

    @include breakpoint(large)
      @include xy-cell(8, false)
      @include xy-cell-block(true)
      // foundation xy-cell includes with margins: false fail to remove width calc for gutters, so we're overriding
      width: 33.33333%
      position: relative
      height: 100%
      overflow-y: hidden

  .map
    &.mapVisible
      display: block

    @include xy-cell(24, false)
    width: 100%
    height: 100%

    @include breakpoint(large)
      @include xy-cell(16, false)
      width: 66.66667%

      @include breakpoint(large)
        display: block

.results-container
  height: calc(100vh - 22rem)
  padding: 1rem
  overflow-y: scroll
  @include breakpoint(large)
    height: calc(100vh - 19rem)

.results-container /deep/ .activities-count .results-container
  overflow: hidden
  padding: 0

.panel-head.locations,
.panel-head.activities
  + .results-container
    height: calc(100vh - 14rem)

.overflow-wrap
  overflow-wrap: break-word

address
  font-style: normal

table
  background: #f0f0f0
  width: auto
  td
    padding: .5rem

h2
  font-weight: bold

.toggleMap
  width: 100%
  position: fixed
  bottom: 0
  z-index: 15000
</style>
