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
            :selected="entityType === 'programs'"
          >
            <ul class="pprf-taxonomy-terms-list">
              <li
                v-for="term in activityTypes"
                class="pprf-taxonomy-terms-card">
                {{term.ActivityTypeName}}
              </li>
            </ul>
          </pprf-tab>

          <pprf-tab
            name="Locations"
            :selected="entityType === 'locations'"
          >
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
import store from '@/store'
export default {
  name: 'PPRF-Sidebar-Entity-Taxo-Container',

  props: ['entityType'],

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab
  },

  beforeRouteEnter (to, from, next) {
    console.log(store)
    if (!store.state.entities.activity_type.length) {
      api.getTerms().then(results => {
        next(vm => {
          vm.$store.dispatch('updateEntities', {type: 'activity_type', data: results.data})
        })
      })
    } else {
      next()
    }
  },

  computed: {
    ...mapState({
      search: state => state.search,
      programs: state => state.entities.program,
      activityTypes: state => state.entities.activity_type,
      facilities: state => state.entities.facility,
      activeTab: state => state.activeTab
    })
  },

  methods: {
    updateRoute (tab) {
      this.$router.push({path: `/categories/${tab.name.toLowerCase()}`})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
