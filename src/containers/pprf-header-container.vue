<template>
    <pprf-header
      :onSearchSubmit="updateSearchRouteParams"
      :searchPrefill="searchInput"
    >
    </pprf-header>
</template>

<script>
// import { mapState } from 'vuex'
// import entitiesListData from '@/mixins/entities-list-data'
import pprfHeader from '@/components/pprf-header'

export default {
  name: 'PPRF-Header-Container',

  components: {pprfHeader},

  data () {
    return {
      searchInput: {
        disabled: true,
        fields: {
          freetext: null,
          address: null,
          zip: null
        }
      }
    }
  },

  mounted () {
    const searchRouteParams = this.$store.state.route.query.hasOwnProperty('freetext') ? this.$store.state.route.query : null

    if (searchRouteParams) {
      this.updateSearchInputVals(searchRouteParams)
    }

    if (!this.$store.state.route.from.name && searchRouteParams) {
      this.$store.dispatch('submitSearch', {fields: searchRouteParams})
    }
  },

  methods: {
    /**
     * give a route params oject to match that matches the
     * local state search fields udpate the search route url to
     * include those params in order to allow for deeplinking
     * @param  {Object} queryParams query params  object matching the local state serch fields object
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    updateSearchRouteParams (queryParams = {freetext: null, address: null, zip: 0}) {
      if (this.$store.state.route.name !== 'Search') {
        this.$router.push({path: 'search', query: queryParams})
      } else {
        this.$router.replace({path: 'search', query: queryParams})
      }
    },
    /**
     * if url query params are give update the input
     * fields to reflect those values
     * NOTE: does not update local state
     * @param  {object} fieldValues query parameter object
     * @return {void}
     *
     * @since 0.0.0
     */
    updateSearchInputVals (fieldValues = this.$store.state.route.query) {
      this.searchInput.fields = Object.assign({}, this.searchInput.fields, fieldValues)
      if (Object.values(this.searchInput.fields).some(val => val)) {
        this.searchInput.disabled = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
