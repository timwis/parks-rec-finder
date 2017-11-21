<template>
  <pprf-sidebar>

    <div class="pprf-sidebar-inner">
            <header class="pprf-sidebar-header">

              <h2 class="pprf-sidebar-header__title text-nopad">Search results</h2>
              <div class="pprf-sidebar-header__desc">
                <p v-show="(programsCount+facilitiesCount) > 0">
                    Showing {{programsCount+facilitiesCount}} results <span v-show="search.freetext">for <b>{{search.freetext}}</b></span> <span v-show="search.address"> near {{search.address}}</span> <span v-show="search.zip" >around {{search.zip}}</span>
                </p>
              </div>
            </header>

            <main class="pprf-sidebar-main">
              <pprf-tabs>
                <pprf-tab
                    name="Programs"
                    :count="programsCount"
                    :selected="true"
                   >
                      <div
                        v-for="program in programs"
                        class="card card--program"
                      >
                        <h4>{{program.program_name}}</h4>
                        <p v-show="(program.distance && program.within_zip_code === undefined)"><small>{{  program.distance }} miles away</small></p>
                        <p v-show="program.within_zip_code === true"> within {{search.zip}}</p>
                        <p v-show="program.within_zip_code === false" :title="'apprx. '+program.distance +' miles away'"> nearby {{search.zip}}</p>
                      </div>

                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="facilitiesCount"
                  >
                    <div
                      v-for="facility in facilities"
                      class="card card--program"
                    >
                      <h4>{{facility.facility_name}}</h4>
                      <p v-show="facility.distance"><small>{{ facility.distance }} miles away</small></p>
                    </div>
                  </pprf-tab>

              </pprf-tabs>
            </main>
          </div>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store/'
import pprfSidebar from '@/components/pprf-sidebar'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import entitiesListData from '@/mixins/entities-list-data'

export default {

  name: 'PPRF-Sidebar-Search-Container',

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab
  },

  mixins: [entitiesListData],

  created () {
    // if deeplinked and search params passed to url
    if (!this.$store.state.route.from.name && this.routeParams) {
      this.queryParamsSearch(this.routeParams)
    }
  },

  methods: {
    queryParamsSearch (queryParams) {
      store.dispatch('submitSearch', {fields: queryParams})
    }
  },

  computed: {
    ...mapState({
      search: state => state.search.fields,
      routeParams: state => Object.assign({}, store.state.search.fields, store.state.route.query)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
