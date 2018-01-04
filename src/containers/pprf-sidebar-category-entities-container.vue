<template>
  <pprf-sidebar
    class="pprf-sidebar--category pprf-sidebar--nopad"
  >
      <div
        slot="sidebar-header"
        class="pprf-sidebar__header--category"
      >
        <h2 class="pprf-sidebar__title pprf-sidebar__title--category">{{taxoName}}</h2>
        <pprf-results-count-badge
          :count="resultsCount"
          icon="map-marker-alt"
          class="category-results-badge"
        />
        <pprf-filter-bar
          v-if="entityType == 'programs'"
          slot="beforePanes"
          @applyFilters="filterEntities"
        />
      </div>

      <div
        slot="sidebar-main"
        class="scrollable"
      >
        <ul class="category-list">
            <li
              v-for="program in programs"
              :key="getUUID('program')"
              v-if="entityType === 'programs' && programs"
            >
               <pprf-program-card
                :selected="activeCardID === program.program_id"
                :id="'program--'+program.program_id"
                :name="program.program_name"
                :ages="{high: program.age_high, low: program.age_low}"
                :gender="program.gender"
                :fee="program.fee"
                :programID="program.id"
              />
            </li>


            <li
              v-if="entityType == 'locations' && facilities"
              v-for="location in facilities"
              :key="getUUID('location')"
            >
              <pprf-location-card
                :name="location.facility_name"
                :address="location.address"
                :facilityID="location.id"
              />
            </li>

         </ul>
      </div>


  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import {deSlugify} from '@/utilities/utils'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'
import pprfLocationCard from '@/components/pprf-location-card'
import pprfResultsCountBadge from '@/components/pprf-results-count-badge'
import {EventBus} from '@/event-bus'
import _ from 'underscore'

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
    pprfResultsCountBadge
  },

  data () {
    return {
      scrollOptions: {
        container: '.scrollable',
        easing: 'ease-in',
        onDone: function () {},
        x: false,
        y: true
      },
      activeCardID: null
    }
  },

  mounted () {
    EventBus.$on('map:markerClick', ({type, id}) => {
      this.selectCard(type, id)
    })
  },

  /*
   * @see [Vue Router Data Fetching](https://router.vuejs.org/en/advanced/data-fetching.html)
   */
  beforeRouteEnter (to, from, next) {
    api.getTaxonomyTermEntities(to.params, to.query).then(results => {
      next(vm => {
        let entity = to.params.entityType === 'locations' ? 'facility' : 'program'
        vm.$store.dispatch('updateEntities',
          {
            [entity]: results.data.rows
          }
        )
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
            let entity = this.entityType === 'locations' ? 'facility' : 'program'
            this.$store.dispatch('updateEntities', { [entity]: results.data.rows })
            this.$store.dispatch('setMapMarkers', {entityType: entity})
          })
    },
    /*
    * scroll to selected card
    *
    * @since 0.1.0
    */
    selectCard (type, id) {
      this.activeCardID = id
      this.$scrollTo(`#${type}--${id}`, 1000, this.scrollOptions)
    },
    getUUID (entityType) {
      return _.uniqueId(`${entityType}-`)
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
      if (this.entityType === 'locations') {
        return this.facilities.length
      } else if (this.entityType === 'programs') {
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
  .pprf-sidebar__title--category{
    display: inline-block;
    width: 75%;
  }
  .card--program--selected{
    border-radius: $border-radius;
    box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2);
  }

</style>
