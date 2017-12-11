<template>
  <pprf-sidebar>

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

        <div slot="sidebar-main">
          <pprf-tabs>

                <pprf-filter-bar
                  slot="beforePanes"
                  @applyFilters="filterEntities"
                  v-show="this.activeTab == 'program'"
                />

                <pprf-tab
                    name="Programs"
                    :count="programs.length"
                    :selected="true"
                   >
                      <pprf-program-card
                        v-if="program"
                        v-for="program in programs"
                        class="card card--program"
                        :key="program.id"
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
        </div>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'

import pprfSidebar from '@/components/pprf-sidebar'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'
import pprfLocationCard from '@/components/pprf-location-card'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'

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

  methods: {
    filterEntities (filters) {
      this.$store.dispatch('submitSearch', filters)
    }
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
