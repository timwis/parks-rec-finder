<template>
  <div id="application">
    <SiteHeader :term="term" @search="onSearch"/>
    <main>
      <aside class="list">
        <router-view/>
      </aside>
      <section class="map">
        <SiteMap
          :activities="activities"
          :locations="locations"
          :activity="activity"
          :location="location"
          :show="mapShows"
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
  computed: {
    ...mapState([
      'activities',
      'locations',
      'activity',
      'location'
    ]),
    mapShows () {
      // Ideally we'd use props over this.$route but I
      // couldn't think of a better way to do this, and
      // multiple <router-view>s seems overkill.
      return this.$route.meta.mapShows
    },
    term () {
      // This is also not ideal, but I can't think of a
      // better way.
      return this.$route.query.term
    }
  },
  methods: {
    onSearch ({ term }) {
      this.$router.push({
        name: 'activitiesSearchResults',
        query: { term }
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
