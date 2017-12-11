<template>
  <pprf-sidebar>

      <div slot="sidebar-header">
        <div  v-if="entityType === 'programs'">

          <h2 class="pprf-sidebar__title text-nopad">Things to do</h2>
          <div class="pprf-sidebar__desc">
            <p>Chose a category from the list below to find a program for you.</p>
          </div>

        </div>

        <div v-if="entityType === 'locations'">
          <h2  class="pprf-sidebar__title text-nopad">Places to go</h2>
          <div class="pprf-sidebar__desc">
            <p>Choose a category from the list below to explore our locations.</p>
          </div>
        </div>

      </div>


      <div slot="sidebar-main">

         <pprf-tabs
          @tabSelected="updateRoute"
         >
          <pprf-tab
            name="Programs"
            :count="totalResultsCountFor(programCategories)"
            :selected="entityType === 'programs'"
          >
            <ul class="category-list">
              <li v-for="term in programCategories">
                <pprf-category-card
                  :count="term.count"
                  :name="term.activity_category_name"
                  :description="term.activity_category_description"
                >
                </pprf-category-card>
              </li>
            </ul>
          </pprf-tab>


          <pprf-tab
            name="Locations"
            :count="totalResultsCountFor(facilityCategories)"
            :selected="entityType === 'locations'"
          >
            <ul class="category-list">
              <li v-for="term in facilityCategories" >
                <pprf-category-card
                  :count="term.count"
                  :name="term.location_type_name"
                  :description="term.location_type_description"
                >
                </pprf-category-card>
              </li>
            </ul>
          </pprf-tab>
        </pprf-tabs>

      </div>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import api from '@/sources/api'
import pprfCategoryCard from '@/components/pprf-category-card'
import _ from 'underscore'
// import {EventBus} from '@/event-bus'
// import store from '@/store'
// import updateStateFromCache from '@/mixins/update-state-from-cache'

export default {
  name: 'PPRF-Sidebar-Categories-Container',

  props: ['entityType'],

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfCategoryCard
  },

  beforeRouteEnter (to, from, next) {
    // let entityName = to.params.entityType.replace('s', '')
    api.getTaxonomyTerms({taxonomy: 'category'}).then(results => {
      next(vm => {
        vm.$store.dispatch('updateCategories',
          {
            program: results[0].data.rows,
            facility: results[1].data.rows
          }
        )
        // vm.$store.dispatch('updateSearchInput', store.state.search)
      })
    })
  },

  computed: {
    ...mapState({
      programCategories: state => state.entities.category.program,
      facilityCategories: state => state.entities.category.facility,
      activeTab: state => state.activeTab
    })
  },

  methods: {
    updateRoute (tab) {
      this.$router.push({path: `/${tab.name.toLowerCase()}`})
    },

    slugifyURL (entityTerm) {
      let termSlug = entityTerm.split(' ').map(termPart => termPart.charAt(0).toLowerCase() + termPart.slice(1)).join('-')
      return `/${this.entityType}/${termSlug}`
    },
    totalResultsCountFor (categories) {
      return _.reduce(_.pluck(categories, 'count'), function (memo, num) { return memo + num }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.category-list{
  list-style: none;
  margin:0;
  padding:0;
}
</style>
