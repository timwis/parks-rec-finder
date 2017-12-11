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
          slot="beforePanes"
          @applyFilters="filterEntities"
        />
      </div>

         <ul
          slot="sidebar-main"
          class="category-list">
            <li
              v-for="program in programs"
              :key="program.id"
              v-if="entityType=== 'programs' && programs"
            >
               <pprf-program-card
                class="card card--program"
                :name="program.program_name"
                :ages="{high: program.age_high, low: program.age_low}"
                :gender="program.gender"
                :fee="program.fee"
                :programID="program.program_id"
              />
            </li>


            <li
              v-if="entityType == 'locations' && facilities"
              v-for="location in facilities"
            >
              <pprf-location-card
                :name="location.facility_name"
                :address="location.address"
                :facility-id="location.id"
              />
            </li>

         </ul>

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

export default {
  name: 'PPRF-Sidebar-Category-Entities-Container',

  props: ['entityType', 'entityTerm'],

  components: {
    pprfSidebar,
    pprfFilterBar,
    pprfProgramCard,
    pprfLocationCard,
    pprfResultsCountBadge
  },

  beforeRouteEnter (to, from, next) {
    api.getTaxonomyTermEntities(to.params, to.query).then(results => {
      next(vm => {
        let entity = to.params.entityType === 'locations' ? 'facility' : 'program'
        vm.$store.dispatch('updateEntities',
          {
            [entity]: results.data.rows
          }
        )
      })
    })
  },

  methods: {
    filterEntities () {
      api.getTaxonomyTermEntities(this.$store.state.route.params, this.search.filters)
          .then(results => {
            let entity = this.entityType === 'locations' ? 'facility' : 'program'
            this.$store.dispatch('updateEntities', { [entity]: results.data.rows })
          })
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

</style>
