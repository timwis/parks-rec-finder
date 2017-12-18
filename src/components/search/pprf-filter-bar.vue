<template>
  <section class="pprf-filter-bar">
    <header
      class="pprf-filter-bar__header"
    >
      <div @click="open = !open">
        <h4 class="text-nopad">Filters</h4>
        <font-awesome-icon :icon="icon" />
      </div>

      <div v-show="!open" class="pprf-filter-bar-tags-bar">
        <h5 class="screen-reader-text">Applied Search Filters:</h5>
        <ul class="pprf-filter-bar-tags">
         <li v-for="(value, key) in tags" >
            <button class="pprf-filter-bar-filter-tag">{{value}} <font-awesome-icon icon="times" size="xs" class="pprf-filter-bar-filter-tag__remove" @click="removeFilter(key)" />
            </button>
          </li>
        </ul>
      </div>

    </header>
    <form
      :class="[{'pprf-filter-bar-form__open':open}, 'pprf-filter-bar-form']"
      @submit.prevent="onSubmit"
      ref="searchFilterForm"
    >
      <fieldset class="pprf-filter-bar-form--fieldset">

        <legend>Fee</legend>

        <v-radio-group
          v-model="filters.fee"
          :mandatory="false"
        >
          <v-radio
            class="field field__inline field-fee--free"
            label="Free"
            value="Free"
            @change="onInput"
          ></v-radio>
          <v-radio
            class="field field__inline field-fee--fee"
            label="Fee"
            value="Fee"
            @change="onInput"
          ></v-radio>
        </v-radio-group>

        <!-- <div class="field field__inline field-fee--free">
          <input
            id="filter-fee__free"
            type="radio"
            name="fee"
            v-model="filters.fee"
            value="Free"
            @change="onInput"
          >
          <label class="field-label field-label__inline" for="fee">Free</label>
        </div>

        <div class="field field__inline field-fee--fee">
          <input
            id="filter-fee__fee"
            type="radio"
            name="fee"
            v-model="filters.fee"
            value="Fee"
            @change="onInput"
          >
          <label class="field-label field-label__inline" for="fee">Fee</label>
        </div> -->

      </fieldset>


      <fieldset class="pprf-filter-bar-form--fieldset">

        <legend>Age Range</legend>

        <div
          class="field field-age"
          v-for="(ageGroup, idx) in ageGroups"
        >
          <v-checkbox
            :label="ageGroup.name"
            :value="ageGroup.range"
            v-model="ageArr"
            ref="filter-age"
            light
          >
          </v-checkbox>
          <!-- <input
            id="age"
            type="checkbox"
            :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()"
            :value="ageGroup.range"
            ref="filter-age"
            @change="updateAgeRange($event.target.value)"
          > -->
          <!-- <label class="field-label field-label__inline" :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()">{{ageGroup.name}}</label> -->
        </div>

      </fieldset>


      <fieldset class="pprf-filter-bar-form--fieldset">

        <legend>Gender</legend>

        <div
          class="field"
          v-for="gender in genders"
        >
          <input
            :id="'gender__'+gender.name.toLowerCase()"
            type="radio"
            :name="'filter-gender--'+gender.name.toLowerCase()"
            v-model="filters.gender"
            :value="gender.value"
            :true-value="gender.value"
            @change="onInput"
          >
          <label class="field-label field-label__inline" :for="'gender__'+gender.name.toLowerCase()">{{gender.name}}</label>
        </div>

      </fieldset>


      <footer class="pprf-filter-bar-footer">

        <phila-button @click.prevent="clearFilters">
          Cancel
        </phila-button>

        <phila-button>
          Apply Filters
        </phila-button>

      </footer>
    </form>
  </section>
</template>

<script>
import PhilaButton from '@/components/phila/phila-button'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import _ from 'underscore'

/**
 * Filter Bar
 * Search filter container to add filtes to the global serach state
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Filter-Bar',

  components: {FontAwesomeIcon, PhilaButton},

  data () {
    return {
      open: true,

      ageGroups: [
        {
          name: 'Tot 2-5 (or younger)',
          range: [2, 5]
        },
        {
          name: 'Youth (6-12)',
          range: [6, 12]
        },
        {
          name: 'Teen (13-19)',
          range: [13, 19]
        },
        {
          name: 'Adult (20-55)',
          range: [20, 55]
        },
        {
          name: 'Senior (55+)',
          range: [55, 99]
        }
      ],

      genders: [
        {
          name: 'All Genders',
          value: 'M/F'
        },
        {
          name: 'Male',
          value: 'M'
        },
        {
          name: 'Female',
          value: 'F'
        }
      ],

      ageArr: [],

      filters: {
        fee: null,
        gender: null
      }
    }
  },

  mounted () {
    let filterDefs = Object.keys(this.$store.state.search.filters).concat('ages')
    let searchFiltersFromRoute = _.intersection(Object.keys(this.$store.state.route.query), filterDefs)

    if (searchFiltersFromRoute.length > 0) {
      this._updateFiltersFromRoute()
    }
  },

  computed: {
    filtersList () {
      return Object.assign({}, this.filters, {ageRange: this.ageRange})
    },

    ageRange () {
      return {
        low: this.ages.length ? Math.min.apply(Math, this.ages) : null,
        high: this.ages.length ? Math.max.apply(Math, this.ages) : null
      }
    },

    ages: {
      set: function (newVal) {
        this.ageArr.push(newVal)
      },
      get: function () {
        return _.flatten(this.ageArr)
      }
    },

    tags () {
      let filters = Object.assign({}, this.filters, {ages: this.ageArr.length ? `Ages ${this.ageRange.low} - ${this.ageRange.high}` : null})
      return _.omit(filters, val => _.isNull(val))
    },

    icon () {
      return (this.open ? 'minus' : 'plus')
    }
  },

  methods: {
    /**
     * On filter value update reflect change in loccal and global state
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    onInput () {
      this.$store.dispatch('updateSearchInput', {filters: this.filtersList})
    },
    /**
     * On Form Submission submit search with filter values
     *
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    onSubmit () {
      this._updateRouteFromFilters()
      this.$emit('applyFilters', {filters: this.filtersList})
      this.open = false
    },

    /**
     * Reset all filter values to null
     *
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    clearFilters () {
      this.ageArr = []
      this.filters = {
        fee: null,
        gender: null
      }
      this._updateRouteFromFilters()
      this.onInput()
      this.onSubmit()
      this.$emit('clearFilters')
      this.open = false
    },

    removeFilter (filterKey) {
      switch (filterKey) {
        case 'ages':
          this.ageArr = []
          break
        default:
          this.filters[filterKey] = null
      }
      this.onInput()
      this.onSubmit()
    },
    /**
     * Update url params from user selected fiter values
     * @return {void}
     *
     * @since 0.0.0
     * @TODO: move to a more glocal location (i.e utility functions)
     */
    _updateRouteFromFilters () {
      let ages = this.ages.length ? `${this.ageRange.low}-${this.ageRange.high}` : null
      let _query = Object.assign({}, this.$store.state.route.query, this.filters, {ages})
      let query = _.omit(_query, val => _.isNull(val))
      this.$router.replace({query})
    },

    /**
     * Update the local and global state with filter values
     * from url parametes
     *
     * @return {void}
     * @since 0.0.0
     */
    _updateFiltersFromRoute () {
      let queryParams = Object.keys(this.$store.state.route.query)
      let filterKeys = Object.keys(this.filters)
      filterKeys.push('ages')
      // check to see if any filters are in url params
      let paramKeys = _.intersection(queryParams, filterKeys)

      if (paramKeys.length > 0) {
        // update filters with url parma values
        paramKeys.forEach(key => {
          switch (key) {
            case 'ages':
              // get the array of age values from query params
              let agesFromParams = this.$store.state.route.query[key].split('-').map(st => parseInt(st))
              // loop through our age range checkboxes
              for (var i = 0; i < this.$refs['filter-age'].length; i++) {
                let $ref = this.$refs['filter-age'][i]
                // check to see if there values fall within the range of values from the query params
                if (_.intersection($ref.value, _.range(agesFromParams[0], agesFromParams[1])).length > 0) {
                  // update local state
                  this.ageArr.push(this.ageGroups[i].range)
                  // hack to show the boxes as checked
                  $ref.$el.children[1].children[0].innerHTML = 'check_box'
                }
              }
              break
            // case 'fee':
            //   this.filters[key] = this.$store.state.route.query[key]
            //   break
            default:
              this.filters[key] = this.$store.state.route.query[key]
              break
          }
        })
      }
      // update state with filter values
      this.onInput()
    }
  },
  watch: {
    '$route.query': function (val) {
      let filterDefs = Object.keys(this.$store.state.search.filters).concat('ages')
      let searchFiltersFromRoute = _.intersection(Object.keys(val), filterDefs)
      if (searchFiltersFromRoute.length) {
        this._updateFiltersFromRoute()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-filter-bar{
  width: 100%;
  color: $black;
  display: block;
  position:relative;
  z-index:5;
  background: lighten(color(light-ben-franklin), 10%);
  border-top: 1px solid $white;
}
.pprf-sidebar--nopad {
  .pprf-filter-bar__header {padding: 0 20px;}
}
.pprf-filter-bar__header{
  h4{display:inline; marign-bottom:0; padding-bottom:0;}
  .svg-inline--fa{
    margin:2% 2% 0 2%;
    float:right;
  }
}

.pprf-filter-bar-tags-bar{
  width: 100%;
  display:flex;
}

.pprf-filter-bar-tags{
  display: flex;
  margin:0;
  padding:0;
  list-style:none;
}

.pprf-filter-bar-filter-tag{
  display: flex;
  border: none;
  border-radius: 10px;
  padding-top: 2px;
  background: lighten(color(sidewalk), 5%);
  margin:0px 5px 5px 5px;
  @include rem(font-size, 1.25);
}

  .svg-inline--fa.pprf-filter-bar-filter-tag__remove{
    margin:3px 0px 3px 8px;
    opacity: 0.5;
    transition: all 0.5s ease;
    &:hover{
      opacity: 1;
      cursor: pointer;
      cursor: hand;
    }
  }



.pprf-filter-bar-form{
  width: 100%;
  display:none;
  background: color(ghost-gray);
}

.pprf-filter-bar-form__open{
  display: block;
  height: 100vh;
}

.pprf-filter-bar-footer{
  width: 100%;
  position:absolute;
  left:0;
  .button{
    padding:10px;
  }
}

.pprf-filter-bar-form--fieldset{

}
</style>
