<template>
  <pprf-sidebar
    class="pprf-sidebar--nopad pprf-sidebar--search"
  >

      <div slot="sidebar-header">
          <h2 class="pprf-sidebar__title text-nopad">Search results</h2>
          <div class="pprf-sidebar__desc">
            <p>
                Showing {{resultsCount}} results
                <span v-show="search.fields.freetext">for <b>{{search.fields.freetext}}</b></span>
                <span v-show="search.fields.address"> near {{search.fields.address}}</span>
                <span v-show="search.fields.zip" >around {{search.fields.zip}}</span>
            </p>
          </div>
      </div>


          <pprf-tabs
            slot="sidebar-main"
          >

                <pprf-filter-bar
                  slot="beforePanes"
                  v-show="this.activeTab == 'program'"
                  @applyFilters="filterSearch"
                ></pprf-filter-bar>

                <pprf-tab
                    name="Programs"
                    :count="programs.length"
                    :selected="true"
                   >
                      <pprf-program-card
                        v-if="program.program_id"
                        v-for="program in programs"
                        :key="getUUID('programCard')"
                        :name="program.program_name"
                        :ages="{high: program.age_high, low: program.age_low}"
                        :gender="program.gender"
                        :fee="program.fee"
                        :programID="program.program_id"
                        :location="{ address: program.facility_address, name: program.facility_name, id: program.facility_id }"
                      />

                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="facilities.length"
                  >
                    <div
                      v-for="facility in facilities"
                      :key="getUUID('facilityCard')"
                    >
                      <pprf-location-card
                        :name="facility.facility_name"
                        :address="facility.address"
                        :facilityID="facility.id"
                        :distance="facility.distance"
                      />
                    </div>
                  </pprf-tab>

              </pprf-tabs>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'

import pprfSidebar from '@/components/pprf-sidebar'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'
import pprfLocationCard from '@/components/pprf-location-card'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import _ from 'underscore'
/**
 * SEARCH RESULTS SIDEBAR STATE CONTAINER
 *
 * Contains the filterable list of search results.
 *
 * Maps search, programs, facilities, and activeTab to state
 *
 * @since 0.1.0
 */
export default {

  name: 'PPRF-Sidebar-Search-Container',

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfFilterBar,
    pprfProgramCard,
    pprfLocationCard
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
  },

  methods: {
    filterSearch (filters) {
      this.$store.dispatch('submitSearch', {filters: filters})
    },
    // generate ids for our cards because our data isn't clean enough
    //
    getUUID (entityType) {
      return _.uniqueId(`${entityType}-`)
    }
  }
}
</script>

<style lang="scss" >
.pprf-sidebar.pprf-sidebar--nopad.pprf-sidebar--search{
  padding:0 ;
    .pprf-back-btn{margin-left:0;}
    .pprf-sidebar__header,
    .pprf-tabs__nav,
    .pprf-tabs__panels{
      padding: 0 20px !important;
    }
    .pprf-sidebar__main{
      padding:0 !important;
    }
    .pprf-filter-bar{margin-top: 10px;}
    .pprf-filter-bar--open{
      margin-top: 50px !important;
    }
  }

</style>
