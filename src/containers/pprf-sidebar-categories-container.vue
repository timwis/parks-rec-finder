<template>
  <pprf-sidebar class="pprf-sidebar--categories">

      <div slot="sidebar-header">
        <div  v-if="activeEntityType === 'program'">

          <h2 class="pprf-sidebar__title text-nopad">Things to do</h2>
          <div class="pprf-sidebar__desc">
            <p>Choose a category from the list below to find an activity.</p>
          </div>

        </div>

        <div v-if="activeEntityType === 'facility'">
          <h2  class="pprf-sidebar__title text-nopad">Places to go</h2>
          <div class="pprf-sidebar__desc">
            <p>Choose a category from the list below to explore our locations.</p>
          </div>
        </div>

      </div>




         <pprf-tabs
          slot="sidebar-main"
          @tabSelected="updateRoute"
         >
          <pprf-tab
            name="Activities"
            :count="totalResultsCountFor(programCategories)"
            :selected="activeEntityType === 'program'"
          >
            <ul class="category-list">
              <li v-for="term in programCategories">
                <pprf-category-card
                  :count="term.count"
                  :name="term.activity_category_name"
                  :description="term.activity_category_description"
                  :photoURL="term.activity_category_photo"
                >
                </pprf-category-card>
              </li>
            </ul>
          </pprf-tab>


          <pprf-tab
            name="Locations"
            :count="totalResultsCountFor(facilityCategories)"
            :selected="activeEntityType === 'facility'"
          >
            <ul class="category-list">
              <li v-for="term in facilityCategories" >
                <pprf-category-card
                  :count="term.count"
                  :name="term.location_type_name"
                  :description="term.location_type_description"
                  :photoURL="term.location_type_photo"
                >
                </pprf-category-card>
              </li>
            </ul>
          </pprf-tab>
        </pprf-tabs>

  </pprf-sidebar>
</template>

<script>
import { mapState } from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'
import resolveEntityType from '@/utilities/entity-type-resolver'
import api from '@/sources/api'
import pprfCategoryCard from '@/components/pprf-category-card'
import _ from 'underscore'
import slugify from 'slugify'

/**
 * ENTITY CATEGORY TERMS STATE CONTAINER
 *
 * Fetches an entity's (programs | locations) category terms
 * and displays them in a tabbed sidebar of category cards
 * @see [Vue Router Data Fetching](https://router.vuejs.org/en/advanced/data-fetching.html)
 *
 * @since 0.1.0
 *
 */
export default {
  name: 'PPRF-Sidebar-Categories-Container',

  props: {
    /**
     * Entity type passed from the route param
     * with the same name
     */
    entityType: {
      type: String
    }
  },

  components: {
    pprfSidebar,
    pprfTabs,
    pprfTab,
    pprfCategoryCard
  },
  /**
   * Fetch our categories list data from the api and attach it to the state
   * before we load the view.
   * Display categories list w/ tabs containing category cards.
   * Tab navigation updates the route.
   * @see [Vue Router Data Fetching](https://router.vuejs.org/en/advanced/data-fetching.html)
   *
   * @since 0.1.0
   */
  beforeRouteEnter (to, from, next) {
    api.getTaxonomyTerms({taxonomy: 'category'}).then(results => {
      next(vm => {
        vm.$store.dispatch('updateCategories',
          {
            program: results[0],
            facility: results[1]
          }
        )
      })
    })
  },

  computed: {
    activeEntityType () {
      return resolveEntityType(this.entityType).name
    },
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
      return `/${this.entityType}/${slugify(entityTerm)}`
    },

    totalResultsCountFor (categories) {
      return _.reduce(_.pluck(categories, 'count'), function (memo, num) { return memo + num }, 0)
    }
  }
}
</script>

<style lang="scss">
.pprf-sidebar.pprf-sidebar--categories{

  .pprf-tabs__panels{
    top: 50px;
  }
  .pprf-sidebar__title--category{
    max-width: 75%;
  }
  .category-list{
    list-style: none;
    margin:0;
    padding:0;
  }

}


@include breakpoint(medium down) {


}



</style>
