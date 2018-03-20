<template>
  <pprf-sidebar
    :class="['pprf-sidebar--category', `pprf-sidebar--category--${entityType}`, 'pprf-sidebar--nopad']"
  >
      <div
        slot="sidebar-header"
        class="pprf-sidebar__header--category"
      >
        <h2 class="text-caps pprf-sidebar__title pprf-sidebar__title--category">{{taxoName}}</h2>
        <pprf-results-count-badge
          :count="resultsCount"
          icon="map-marker-alt"
          class="category-results-badge"
        />
        <pprf-filter-bar
          v-if="activeEntityType === 'program'"
          slot="beforePanes"
          :disabled="mobile.searchOpen"
          @applyFilters="filterEntities"
        />
      </div>

      <div
        slot="sidebar-main"
        class="scrollable entity-list-container"
      >
        <ul class="category-list">
            <li
              v-for="program in programs"
              :key="getUUID('program')"
              v-if="activeEntityType === 'program' && programs"
            >
               <pprf-program-card
                :selected="activeCardID === program.id"
                :name="program.program_name"
                :ages="{high: program.age_high, low: program.age_low}"
                :gender="program.gender"
                :fee="program.fee"
                :feeFreq="program.fee_frequency"
                :programID="program.id"
                :location="{ address: program.facility_address, name: program.facility_name, id: program.facility_id }"

              />
            </li>


            <li
              v-if="activeEntityType == 'facility' && facilities"
              v-for="location in facilities"
              :key="getUUID('location')"
            >
              <pprf-location-card
                :selected="activeCardID === location.id"
                :class="[{'card--selected': activeCardID === location.id}]"
                :name="location.facility_name"
                :address="location.address"
                :facilityID="location.id"
              />
            </li>

         </ul>
      </div>
    <pprf-mobile-view-toggle-btn slot="sidebar-footer"/>
  </pprf-sidebar>
</template>

<script>
// utilities
import _ from 'underscore'
import {deSlugify} from '@/utilities/utils'
import resolveEntityType from '@/utilities/entity-type-resolver'

// state
import { mapState, mapActions } from 'vuex'
// mixins
import scrollListToMapPinMixin from '@/mixins/scroll-list-to-map-pin'

// components
import pprfSidebar from '@/components/pprf-sidebar'
import pprfMobileViewToggleBtn from '@/components/buttons/pprf-mobile-view-toggle-btn'

import pprfFilterBar from '@/components/search/pprf-filter-bar'

import pprfProgramCard from '@/components/cards/pprf-program-card'
import pprfLocationCard from '@/components/cards/pprf-location-card'
import pprfResultsCountBadge from '@/components/cards/pprf-results-count-badge'

/**
 * CATEGORY ENTITIES STATE CONTAINER
 *
 * Fetches all entities for a given category term and
 * displays them in a filterable list.
 * @see [Vue Router Data Fetching](https://router.vuejs.org/en/advanced/data-fetching.html)
 *
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Sidebar-Category-Entities-Container',
  mixins: [scrollListToMapPinMixin],

  props: {
    /**
     * Entity type passed from the route param
     * with the same name
     */
    entityType: {
      type: String
    },

    /**
     * Category term passed from the route param
     * with the same name
     */
    entityTerm: {
      type: String
    }
  },

  components: {
    pprfSidebar,
    pprfFilterBar,
    pprfProgramCard,
    pprfLocationCard,
    pprfResultsCountBadge,
    pprfMobileViewToggleBtn
  },

  /*
   * @see [Vue Router Data Fetching](https://router.vuejs.org/en/advanced/data-fetching.html)
   */
  created () {
    const { params, query } = this.$route
    this.resetEntities()
    this.getEntities({ params, query })
  },

  methods: {
    /**
     * re-fetch data with filter params
     *
     * @return {void}
     * @since 0.1.0
     */
    filterEntities (filters) {
      const params = this.$route.params
      this.getEntities({ params, filters })
    },

    getUUID (entityType) {
      return _.uniqueId(`${entityType}-`)
    },

    ...mapActions([
      'resetEntities',
      'getEntities'
    ])
  },

  computed: {
    activeEntityType () {
      return resolveEntityType(this.entityType).name
    },
    ...mapState({
      search: state => state.search,
      programs: state => state.entities.program,
      facilities: state => state.entities.facility,
      activeTab: state => state.activeTab,
      mobile: state => state.mobile
    }),
    resultsCount () {
      let entity = resolveEntityType(this.entityType).name
      if (entity === 'facility') {
        return this.facilities.length
      } else if (entity === 'program') {
        return this.programs.length
      }
    },
    taxoName (taxonomyTerm) {
      return deSlugify(this.entityTerm)
    }
  }
}
</script>

<style lang="scss" scoped>
  .category-list{
    width: 100%;
    display: block;
    margin-top: 20px;
    padding-left:0;
    list-style: none;
    li{margin:0; padding:0;}
  }
  .pprf-sidebar--category--locations{
    .pprf-sidebar__header--category{
      background: #A5097e;
      .pprf-sidebar__title{
        color:$white;
      }
    }
  }
    .pprf-sidebar--category--activities{
      .pprf-sidebar__header--category{
        background: #2176d2;
        .pprf-sidebar__title{
          color:$white;
        }
      }
  }


</style>
