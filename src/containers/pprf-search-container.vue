<template>
  <div id="pprf-search-container" >

    <pprf-header></pprf-header>

    <main class="pprf-app__main">

      <pprf-sidebar>

          <div class="pprf-sidebar-inner">
            <header class="pprf-sidebar-header">

              <h2 class="pprf-sidebar-header__title text-nopad">Search results</h2>
              <div class="pprf-sidebar-header__desc">
                <p v-show="(programs.length+facilities.length) > 0">
                    Showing {{programs.length+facilities.length}} results <span v-show="search.freetext">for <b>{{search.freetext}}</b></span> <span v-show="search.address"> near {{search.address}}</span>
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
                      </div>

                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="locationsCount"
                  >
                    <div
                      v-for="facility in facilities"
                      class="card card--program"
                    >
                      <h4>{{facility.facility_name}}</h4>
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
    programsCount (state) {
      return state.programs.length
    },
    locationsCount (state) {
      return state.facilities.length
    },
    ...mapState({
      search: state => state.search.fields,
      programs: state => state.programs.entities,
      facilities: state => state.facilities.entities
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
