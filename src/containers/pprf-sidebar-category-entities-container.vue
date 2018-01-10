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
                :programID="program.id"
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
import api from '@/sources/api'
import { mapState } from 'vuex'
import scrollListToMapPinMixin from '@/mixins/scroll-list-to-map-pin'
import pprfSidebar from '@/components/pprf-sidebar'
import pprfMobileViewToggleBtn from '@/components/pprf-mobile-view-toggle-btn'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'
import pprfLocationCard from '@/components/pprf-location-card'
import pprfResultsCountBadge from '@/components/pprf-results-count-badge'
// import {EventBus} from '@/event-bus'
import _ from 'underscore'
import {deSlugify} from '@/utilities/utils'
import resolveEntityType from '@/utilities/entity-type-resolver'

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
  beforeRouteEnter (to, from, next) {
    api.getTaxonomyTermEntities(to.params, to.query).then(results => {
      next(vm => {
        let entity = resolveEntityType(to.params.entityType).name
        vm.$store.dispatch('updateEntities', {[entity]: results.data.rows})
        vm.$store.dispatch('setMapMarkers', {entityType: entity})
      })
    })
  },

  methods: {
    /**
     * re-fetch data with filter params
     *
     * @return {void}
     * @since 0.1.0
     */
    filterEntities (filters) {
      api.getTaxonomyTermEntities(this.$store.state.route.params, filters)
          .then(results => {
            let entity = resolveEntityType(this.entityType).name
            this.$store.dispatch('updateEntities', { [entity]: results.data.rows })
            this.$store.dispatch('setMapMarkers', {entityType: entity})
          })
    },

    getUUID (entityType) {
      return _.uniqueId(`${entityType}-`)
    }
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
    padding-right: 10px;
    list-style: none;
    li{margin:0; padding:0;}
  }
  .pprf-sidebar--category--locations{
    .pprf-sidebar__header--category{
      background: color(pride-purple);
      .pprf-sidebar__title{
        color:$white;
      }
    }

  }


</style>
