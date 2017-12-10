<template>
  <pprf-sidebar>

      <div slot="sidebar-header">
        <h2  class="pprf-sidebar-header__title text-nopad">{{taxoName}} <small>{{resultsCount}}</small></h2>
        <pprf-filter-bar
          slot="beforePanes"
          @applyFilters="filterEntities"
        />
      </div>

      <main class="pprf-sidebar-main scrollable">
         <ul class="pprf-entity-taxo--single-list">
            <pprf-program-card
              v-for="program in programs"
              v-if="entityType=== 'programs' && programs"
              class="card card--program"
              :key="program.id"
              :name="program.program_name"
              :ages="{high: program.age_high, low: program.age_low}"
              :gender="program.gender"
              :fee="program.fee"
              :programID="program.program_id"
            />

            <li
              v-if="entityType == 'locations' && facilities"
              v-for="location in facilities"
            >
              {{location.facility_name}}
            </li>

         </ul>
      </main>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import {deSlugify} from '@/utilities/utils'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import pprfProgramCard from '@/components/pprf-program-card'

// import store from '@/store'
// import updateStateFromCache from '@/mixins/update-state-from-cache'

export default {
  name: 'PPRF-Sidebar-Category-Entities-Container',

  props: ['entityType', 'entityTerm'],

  components: {
    pprfSidebar,
    pprfFilterBar,
    pprfProgramCard
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
.pprf-entity-taxo--single-list{
  width: 100%;
  display: block;
  margin-top: 20px;
  padding-left:0;
  padding-right: 10px;
  li{margin:0; padding:0;}
}
</style>
