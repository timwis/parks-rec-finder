<template>
  <section class="pprf-filter-bar">
    <header
      class="pprf-filter-bar-header"
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

        <div class="field field__inline field-fee--free">
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
        </div>

      </fieldset>


      <fieldset class="pprf-filter-bar-form--fieldset">

        <legend>Age Range</legend>

        <div
          class="field field-age"
          v-for="ageGroup in ageGroups"
        >
          <input
            id="age"
            type="checkbox"
            :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()"
            :value="ageGroup.range"
            ref="filter-age"
            @change="updateAgeRange($event.target.value)"
          >
          <label class="field-label field-label__inline" :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()">{{ageGroup.name}}</label>
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
      open: false,

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

      ages: [],

      filters: {
        fee: null,
        gender: null
      }
    }
  },

  mounted () {
    // @TODO: move this search from route else where, maybe beforeRouteEnter in router search route??
    let searchFieldsFromRoute = _.intersection(Object.keys(this.$store.state.route.query), Object.keys(this.$store.state.search.fields))
    let filterDefs = Object.keys(this.$store.state.search.filters).concat('ages')
    let searchFiltersFromRoute = _.intersection(Object.keys(this.$store.state.route.query), filterDefs)
    let searchParamsFromRoute = [...searchFieldsFromRoute, ...searchFiltersFromRoute]

    if (searchFiltersFromRoute.length > 0) {
      this._updateFiltersFromRoute()
    }
    // submit search if deep linked from url
    if (!this.$store.state.route.from.name && searchParamsFromRoute.length > 0 && this.$store.state.route.name === 'Search') {
      this.$store.dispatch('submitSearch')
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

    tags () {
      let filters = Object.assign({}, this.filters, {ages: this.ages.length ? `Ages ${this.ageRange.low} - ${this.ageRange.high}` : null})
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
     * Update the computed age range given
     * @param  {array} rangeArr array of age values to add to global array
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    updateAgeRange (rangeArr) {
      rangeArr.split(',').forEach(age => {
        let _index = this.ages.indexOf(Number(age))
        if (_index > -1) {
          this.ages.splice(_index, 1)
        } else {
          this.ages.push(Number(age))
        }
      })
      this.onInput()
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
      this.ages = []
      this.$refs['filter-age'].forEach(el => { el.checked = false })
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
          this.ages = []
          this.$refs['filter-age'].forEach(el => { el.checked = false })
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
      this.$router.replace({query: _.omit(_query, val => _.isNull(val))})
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
              let agesFromParams = this.$store.state.route.query[key].split('-')
              this.ages = agesFromParams
              this.$refs['filter-age'].forEach(filterEl => {
                if (_.intersection(filterEl.value.split(','), agesFromParams).length > 0) {
                  filterEl.checked = true
                }
              })
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
  }
}
</script>

<style lang="scss" scoped>
.pprf-filter-bar{
  width: 100%;
  color: $black;
  display: block;
  position:relative;
  background: lighten(color(light-ben-franklin), 10%);
}

.pprf-filter-bar-header{
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
