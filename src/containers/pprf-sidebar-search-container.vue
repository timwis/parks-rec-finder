<template>
  <pprf-sidebar>

    <div class="pprf-sidebar-inner">
            <header class="pprf-sidebar-header">

              <h2 class="pprf-sidebar-header__title text-nopad">Search results</h2>
              <div class="pprf-sidebar-header__desc">
                <p v-show="(programs.length+facilities.length) > 0">
                    Showing {{programs.length+facilities.length}} results
                    <span v-show="search.fields.freetext">for <b>{{search.fields.freetext}}</b></span>
                    <span v-show="search.fields.address"> near {{search.fields.address}}</span>
                    <span v-show="search.fields.zip" >around {{search.fields.zip}}</span> <br>

                      <small v-show="this.activeTab == 'program'">
                        <span v-show="search.filters.fee"> that have a <i><b>Fee</b></i></span>
                        <span v-show="search.filters.fee === false"> that are <i><b>Free</b></i></span>
                        <i><b v-show="search.filters.age_range.high > 0"> Ages {{search.filters.age_range.low}} - {{search.filters.age_range.high}} </b></i>
                        <span v-show="search.filters.gender"> for <i><b>{{search.filters.gender == 'M/F' ? 'All Gender' : (search.filters.gender == "M" ? "Male" : "Female")}}s</b></i></span>
                      </small>

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
                      <div
                        v-for="program in programs"
                        class="card card--program"
                      >
                        <h4>{{program.program_name}}</h4>
                        <h5>age: ( {{program.age_low}} - {{program.age_high}})</h5>
                        <h5>fee: {{program.fee}}</h5>
                        <h5>gender:</h5>
                        <ul>
                          <li v-for="gender in program.gender">{{gender}}</li>
                        </ul>
                        <p v-show="(program.distance && program.within_zip_code === undefined)"><small>{{  program.distance }} miles away</small></p>
                        <p v-show="program.within_zip_code === true"> within {{search.zip}}</p>
                        <p v-show="program.within_zip_code === false" :title="'apprx. '+program.distance +' miles away'"> nearby {{search.zip}}</p>
                      </div>

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
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'

export default {

  name: 'PPRF-Sidebar-Search-Container',

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfFilterBar
  },

  computed: {
    ...mapState({
      search: state => state.search,
      programs: state => state.entities.program,
      facilities: state => state.entities.facility,
      activeTab: state => state.activeTab
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
