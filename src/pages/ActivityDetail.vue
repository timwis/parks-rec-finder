<template>
  <main>
    <aside class="list">
      <h2>{{ name }}</h2>
    </aside>
    <section class="map">
      <SiteMap :activity="activity"/>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import SiteMap from '~/components/SiteMap'
import { concatAddress } from '~/util'

export default {
  props: {
    id: String
  },
  components: {
    SiteMap
  },
  computed: {
    ...mapState({
      activity: (state) => state.activity,
      name: (state) => state.activity.name,
    }),
    // directionsUrl () {
    //   return `https://www.google.com/maps/dir/?api=1&query=${this.fullAddress}`
    // },
    // phoneUrl () {
    //   return `tel:${this.phone}`
    // }
  },
  created () {
    this.getActivity(this.id)
  },
  destroyed () {
    this.resetActivity()
  },
  watch: {
    id (newId) {
      this.getActivity(this.id)
    }
  },
  methods: {
    ...mapActions([
      'getActivity'
    ]),
    ...mapMutations({
      resetActivity: 'RESET_ACTIVITY'
    })
  }
}
</script>
