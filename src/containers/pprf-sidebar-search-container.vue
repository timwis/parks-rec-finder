<template>
  <pprf-sidebar>

    <div class="pprf-sidebar-inner">
            <header class="pprf-sidebar-header">

              <h2 class="pprf-sidebar-header__title text-nopad">Search results</h2>
              <div class="pprf-sidebar-header__desc">
                <p>
                    Showing {{resultsCount}} results
                    <span v-show="search.fields.freetext">for <b>{{search.fields.freetext}}</b></span>
                    <span v-show="search.fields.address"> near {{search.fields.address}}</span>
                    <span v-show="search.fields.zip" >around {{search.fields.zip}}</span>
                </p>
              </div>
            </header>

            <main class="pprf-sidebar-main">
              <pprf-tabs>

                <pprf-filter-bar
                  slot="beforePanes"
                  v-show="this.activeTab == 'program'"
                />

                <pprf-tab
                    name="Programs"
                    :count="programs.length"
                    :selected="true"
                   >
                      <pprf-program-card
                        v-for="program in programs"
                        class="card card--program"
                        :key="program.id"
                        :name="program.program_name"
                        :ages="{high: program.age_high, low: program.age_low}"
                        :gender="program.gender[0]"
                        :fee="program.fee"
                      >
                        <!-- <h4>{{program.program_name}}</h4>
                        <h5>age: ( {{program.age_low}} - {{program.age_high}})</h5>
                        <h5>fee: {{program.fee}}</h5>
                        <h5>gender:</h5>
                        <ul>
                          <li v-for="gender in program.gender">{{gender}}</li>
                        </ul>
                        <p v-show="(program.distance && program.within_zip_code === undefined)"><small>{{  program.distance }} miles away</small></p>
                        <p v-show="program.within_zip_code === true"> within {{search.zip}}</p>
                        <p v-show="program.within_zip_code === false" :title="'apprx. '+program.distance +' miles away'"> nearby {{search.zip}}</p> -->
                      </pprf-program-card>

                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="facilities.length"
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
import pprfSidebar from '@/components/pprf-sidebar'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'

export default {

  name: 'PPRF-Sidebar-Search-Container',

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfFilterBar,
    pprfProgramCard
  },

  computed: {
    ...mapState({
      search: state => state.search,
      programs: state => state.entities.program,
      facilities: state => state.entities.facility,
      activeTab: state => state.activeTab
    }),

    resultsCount () {
      return isNaN(this.programs.length + this.facilities.length) ? 0 : (this.programs.length + this.facilities.length)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
