<template>
  <div id="pprf-search-container" >

    <pprf-header></pprf-header>

    <main class="pprf-app__main">
      <pprf-sidebar>
        <span slot="heading">Search Results</span>
        <p slot="description"><small><i>Showing 0 results for ...</i></small></p>

        <div slot="programs-tab-content">
          <div class="card card--program">
            <h4>Program Name</h4>
          </div>
        </div>

        <div slot="locations-tab-content">
          <div class="card card--program">
            <h4>location Name</h4>
          </div>
        </div>

      </pprf-sidebar>

      <pprf-map/>

    </main>

  </div>
</template>

<script>
import pprfHeader from '@/components/pprf-header'
import pprfSidebar from '@/components/pprf-sidebar/'
import pprfMap from '@/components/map/pprf-map'

export default {

  name: 'PPRF-Search-Container',

  components: {
    pprfHeader,
    pprfMap,
    pprfSidebar
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
