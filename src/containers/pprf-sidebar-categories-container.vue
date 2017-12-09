<template>
  <pprf-sidebar>
    <div class="pprf-sidebar-inner">

      <header class="pprf-sidebar-header">
        <h2 v-show="entityType === 'programs'" class="pprf-sidebar-header__title text-nopad">Things to do</h2>
        <h2 v-show="entityType === 'locations'" class="pprf-sidebar-header__title text-nopad">Places to go</h2>
        <div class="pprf-sidebar-header__desc">
          <p>Chose a category from the list below to find a program for you.</p>
        </div>
      </header>

      <main class="pprf-sidebar-main">
         <pprf-tabs
          @tabSelected="updateRoute"
         >
          <pprf-tab
            name="Programs"
            :count="programCategories.length"
            :selected="entityType === 'programs'"
          >
            <ul class="pprf-taxonomy-terms-list">
              <li
                v-for="term in programCategories"
                class="pprf-taxonomy-terms-card">
                <router-link :to="slugifyURL(term.activity_category_name)">
                  {{term.activity_category_name}}
                </router-link>
              </li>
            </ul>
          </pprf-tab>

          <pprf-tab
            name="Locations"
            :count="facilityCategories.length"
            :selected="entityType === 'locations'"
          >
            <ul>
              <li v-for="term in facilityCategories" >
                <router-link :to="slugifyURL(term.location_type_name)">
                  {{term.location_type_name}}
                </router-link>
              </li>
            </ul>
          </pprf-tab>

        </pprf-tabs>
      </main>
    </div>
  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import api from '@/sources/api'
// import {EventBus} from '@/event-bus'
// import store from '@/store'
// import updateStateFromCache from '@/mixins/update-state-from-cache'

export default {
  name: 'PPRF-Sidebar-Categories-Container',

  props: ['entityType'],

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
