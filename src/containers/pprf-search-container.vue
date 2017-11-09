<template>
  <div id="pprf-search-container" >

    <pprf-header></pprf-header>

    <main class="pprf-app__main">

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

      <pprf-map/>

    </main>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import pprfHeader from '@/components/pprf-header'
import pprfSidebar from '@/components/pprf-sidebar'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import pprfMap from '@/components/map/pprf-map'

export default {

  name: 'PPRF-Search-Container',

  components: {
    pprfHeader,
    pprfMap,
    pprfSidebar,
    pprfTabs,
    pprfTab
  },

  data () {
    return {}
  },

  computed: {
    facilities () {
      return this.$store.getters.facilityList
    },
    facilitiesCount (state) {
      return this.$store.getters.facilityListCount
    },

    programs () {
      return this.$store.getters.programList
    },
    programsCount (state) {
      return this.$store.getters.programListCount
    },

    ...mapState({
      search: state => state.search.fields
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
