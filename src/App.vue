<template>
  <div id="application">
    <SiteHeader title="Finder"/>
    <main>
      <aside class="list">
        <router-view/>
      </aside>
      <section class="map">
        <SiteMap
          :activities="activities"
          :locations="locations"
          :location="location"
        />
      </section>
    </main>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import 'phila-standards/dist/css/phila-app.min.css'

import SiteHeader from './components/SiteHeader'
import SiteMap from '~/components/SiteMap'

export default {
  name: 'app',
  components: {
    SiteHeader,
    SiteMap
  },
  computed: mapState([
    'activities',
    'locations',
    'location'
  ])
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
