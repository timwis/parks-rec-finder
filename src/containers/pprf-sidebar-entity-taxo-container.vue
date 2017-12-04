<template>
  <pprf-sidebar>
    <div class="pprf-sidebar-inner">

      <header class="pprf-sidebar-header">
        <h2  class="pprf-sidebar-header__title text-nopad">{{taxoName}} <small>{{programs.length}}</small></h2>
      </header>

      <main class="pprf-sidebar-main">
        <!-- <pprf-filter-bar slot="beforePanes" /> -->
         <ul class="pprf-entity-taxo--single-list scrollable">
           <li
              v-for="program in programs"
              class="card card--program"
            >
              <h4>{{program.program_name}}</h4>
              <h5>category: {{program.category}}</h5>
              <h5>age: ( {{program.age_low}} - {{program.age_high}})</h5>
              <h5>fee: {{program.fee}}</h5>
              <h5>gender:</h5>
              <ul>
                <li v-for="gender in program.gender">{{gender}}</li>
              </ul>
            </li>
         </ul>
      </main>
    </div>
  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'
import pprfFilterBar from '@/components/search/pprf-filter-bar'
import store from '@/store'
import _ from 'underscore'

export default {
  name: 'PPRF-Sidebar-Entity-Taxo-Container',

  props: ['entityType', 'entityTerm'],

  components: {
    pprfSidebar,
    pprfFilterBar
  },

  beforeRouteEnter (to, from, next) {
    let entitiesInState = _.where(store.state.entities.program, {category: to.params.entityTerm.split('-').map(termPart => termPart.charAt(0).toUpperCase() + termPart.slice(1)).join(' ')})

    if (!entitiesInState.length) {
      api.getTaxonomyTerms(to.params).then(results => {
        next(vm => {
          console.log(results)
          vm.$store.dispatch('updateEntitiesFromTaxonomy', {type: 'program', data: results.data})
        })
      })
    } else {
      console.log('entitiesInState')
      next(vm => {
        vm.$store.dispatch('updateMarkers', {entityType: 'program'})
      })
    }
  },

  computed: {

    ...mapState({
      search: state => state.search,
      programs: state => state.entities.program,
      activityTypes: state => state.entities.activity_type,
      facilities: state => state.entities.facility,
      activeTab: state => state.activeTab
    }),

    taxoName () {
      let taxonomyTerm = this.entityTerm.split('-').map(termPart => termPart.charAt(0).toUpperCase() + termPart.slice(1))
      if (taxonomyTerm.indexOf('Environmental') > -1) {
        taxonomyTerm = taxonomyTerm.join('/')
      } else {
        taxonomyTerm = taxonomyTerm.join(' ')
      }
      return taxonomyTerm
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-entity-taxo--single-list{
  width: 100%;
  height: 737px;
  display: block;
  margin-top: 20px;
  padding-right: 10px;
}
</style>
