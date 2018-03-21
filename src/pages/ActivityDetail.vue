<template>
  <div>
    <h2>{{ name }}</h2>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { concatAddress } from '~/util'

export default {
  props: {
    id: String
  },
  computed: {
    ...mapState({
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
