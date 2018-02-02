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
                ></pprf-filter-bar>

                <pprf-tab
                    name="Activities"
                    :count="programs.length"
                    :selected="true"
                   >
                    <ul class="category-list">
                    <li v-if="programs.length > 0">
                      <pprf-program-card
                        v-if="program.id"
                        v-for="program in programs"
                        :key="getUUID('programCard')"
                        :name="program.program_name"
                        :ages="{high: program.age_high, low: program.age_low}"
                        :gender="program.gender"
                        :fee="program.fee"
                        :feeFreq="program.fee_frequency"
                        :programID="program.id"
                        :selected="activeCardID === program.id"
                        :location="{ address: program.facility_address, name: program.facility_name, id: program.facility_id }"
                        :distance="program.distance"
                      />

                    <li v-else-if="facilities.length > 0">
                      No activities were found. Try the <b>Locations</b> tab above.
                    </li>
                  </li>
                </ul>
                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="facilities.length"
                  >
                  <ul class="category-list">
                    <li v-if="facilities.length > 0">
                      <pprf-location-card
                        v-for="facility in facilities"
                        :key="getUUID('facilityCard')"

                        :name="facility.facility_name"
                        :address="facility.address"
                        :facilityID="facility.id"
                        :distance="facility.distance"
                        :selected="activeCardID === facility.id"
                      />
                    </li>
                    <li v-else-if="programs.length > 0">
                      No locations were found. Try the <b>Activities</b> tab above.
                    </li>
                  </ul>
                  </pprf-tab>

              </pprf-tabs>

  </pprf-sidebar>
</template>

<script>
import _ from 'underscore'
import { mapState } from 'vuex'
import scrollListToMapPinMixin from '@/mixins/scroll-list-to-map-pin'
import pprfSidebar from '@/components/pprf-sidebar'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/cards/pprf-program-card'
import pprfLocationCard from '@/components/cards/pprf-location-card'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'

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
  mixins: [scrollListToMapPinMixin],
  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfFilterBar,
    pprfProgramCard,
    pprfLocationCard
  },

  data () {
    return {
      scrollOptions: {
        container: '.pprf-tabs__panels'
      }
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
  },

  methods: {
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
      &.scrollable{
        padding-bottom:3rem !important;

      }
    }
    .pprf-sidebar__main{
      padding:0 !important;
      overflow:hidden;
    }
    .pprf-filter-bar{margin-top: 10px;}
    //.pprf-filter-bar--open{
      //margin-top: 50px !important;
    //}
  }

  @include breakpoint(medium down) {
    .pprf-sidebar--search {
      .pprf-sidebar__desc{
        min-height: 0px;
        p {padding: 0px; margin:0px;}
      }
    }
  }

</style>
