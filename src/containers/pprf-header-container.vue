<template>
  <pprf-header >
  </pprf-header>
</template>

<script>
import pprfHeader from '@/components/pprf-header'

export default {
  name: 'PPRF-Header-Container',

  components: {pprfHeader},

  mounted () {
    const searchRouteParams = this.$store.state.route.query.hasOwnProperty('freetext') ? this.$store.state.route.query : null

    if (!this.$store.state.route.from.name && searchRouteParams) {
      // this.$store.dispatch('submitSearch', {fields: searchRouteParams})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
