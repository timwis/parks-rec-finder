<template>
    <form
      class="pprf-search form"
      @submit.prevent="onSubmit"
    >

      <phila-text-field
        name="freetext"
        placeholder="SEARCH BY ACTIVITY TYPE OR LOCATION NAME"
        ref="freetextField"
        @input="onFreetextInput"
      ></phila-text-field>

      <phila-text-field
        name="address"
        placeholder="ADDRESS OR ZIP CODE"
        icon="map-marker-alt"
        @input="onAddressInput"
        ref="addressField"
      ></phila-text-field>

      <phila-button
        id="pprf-search__submit"
        class="input input__submit pprf-btn"
        :disabled="isDisabled"
        tabindex="3"
      >
        <font-awesome-icon
          icon="search"
        />
      </phila-button>

    </form>
</template>

<script>

import PhilaTextField from '@/components/phila/phila-text-field'
import PhilaButton from '@/components/phila/phila-button'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import _ from 'underscore'

/**
 * SEARCH BAR COMPONENT
 *
 * Contains input fields for performing freetext, address, and zipcode searches.
 *
 * Connects to state to manage the state.search object and dispatch search events
 *
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Search',
  components: {
    PhilaTextField,
    PhilaButton,
    FontAwesomeIcon
  },

  data () {
    return {
      isDisabled: true,
      formSubmited: false,
      search: {
        fields: {
          freetext: null,
          address: null,
          zip: null
        }
      }

    }
  },
  /**
   * manages searching from deeplinks
   *
   * @public
   * @since 0.1.0
   */
  mounted () {
    // search if deep linked to Seach page
    if (this.$store.state.route.from && !this.$store.state.route.from.name) {
      this.searchFromRoute(this.$store.state.route.query)
    }

    /**
     * Update isDisabled when user adds input to search fields
     */
    this.$watch(
        () => {
          return this.$refs.freetextField.isDirty + this.$refs.addressField.isDirty
        },
        (val) => {
          this.isDisabled = !Object.values(this.$refs).some((ref) => { return ref.isDirty === true })
        }
      )
  },

  methods: {
    /**
     * on route query param update, submit the search
     * this allows us to search using the browser's address bar
     * and also syncs searching with browser history
     * @public
     *
     * @param  {object} queryParams query parameters from router
     * @return {void}
     *
     * @since 0.2.7
     */
    searchFromRoute (queryParams) {
      this._updateInputRefsValues(this.$store.state.route.query)
      if (this.$store.state.route.name === 'Search') {
        this.$store.dispatch('submitSearch', {fields: this.searchValuesFromRoute, filters: this.searchFiltersFromRoute})
      }
    },
    /**
     * Sets local search field state
     * @param  {string} freetextVal user input
     * @return {void}
     *
     * @public
     * @since 0.1.0
     */
    onFreetextInput (freetextVal) {
      this.search.fields.freetext = freetextVal
    },
    /**
     * Validates the address field input as either
     * an address or a zipcode and sets the appropriate
     * search field state accordingly
     * @param  {sring | number} addressVal address address or zipcode value
     * @return {void}
     *
     * @public
     * @since 0.1.0
     */
    onAddressInput (addressVal) {
      if (this._isValidZip(addressVal)) {
        this.search.fields.zip = parseInt(addressVal)
        this.search.fields.address = null
      } else {
        this.search.fields.address = addressVal !== '' ? addressVal : null
        this.search.fields.zip = null
      }
    },

    /**
     * updates the url query parameters to match the search values
     * to allow for deep linking of serach results.
     * Dispatches the "submitSearch" event to the store.
     *
     * @param  {object} e submit event
     * @return {void}
     *
     * @public
     * @since 0.1.0
     */
    onSubmit (e) {
      const _fields = this.search.fields
      let newSearch = {
        fields: {
          freetext: _fields.freetext,
          address: _fields.address,
          zip: _fields.zip
        }
      }

      /**
       * Submit event w/ new search fields values
       *
       * @event submit
       * @type {object} search fields
       *
       * @since 0.1.0
       */
      this.$emit('submit', newSearch.fields)
      // update our search route params so our
      // watcher will submit the search
      this.updateSearchRouteParams(this.search.fields)
    },

    /**
     * regex test a for zipcode structure
     * @param  {number}  zipcodeVal zipcode to validate
     * @return {boolean}            true if is valid; false if not
     *
     * @since 0.1.0
     */
    _isValidZip (zipcodeVal) {
      return (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcodeVal))
    },
    /**
      * if url query params are given update the input
      * fields to reflect those values
      *
      * NOTE: does not update local state
      * @param  {object} fieldValues query parameter object
      * @return {void}
      *
      * @since 0.1.0
      */
    _updateInputRefsValues (fieldValues = this.$store.state.route.query) {
      if (fieldValues.freetext) {
        this.isDisabled = false
        this.$refs.freetextField.inputValue = fieldValues.freetext
      } else {
        this.$refs.freetextField.inputValue = null
      }
      if (fieldValues.address || fieldValues.zip) {
        this.isDisabled = false
        this.$refs.addressField.inputValue = fieldValues.address || fieldValues.zip
      } else if (!fieldValues.freetext) {
        this.$refs.addressField.inputValue = null
      }
    },

    /**
     * given a route's query params object to match that matches the local state search fields
     * udpate the search route url to include those params in order to allow for deeplinking
     *
     * @param  {Object} queryParams query params  bject matching the local state serch fields object
     * @return {void}
     *
     * @public
     * @since 0.1.0
     */
    updateSearchRouteParams (queryParams) {
      // merge with current search params
      // let query = Object.assign({}, this.$store.state.route.query, queryParams)
      // only submit submit valid params
      let query = _.omit(queryParams, val => _.isNull(val))
      this.$router.push({path: '/search', query})
    }
  },

  computed: {
    searchFieldsFromRoute () {
      return _.intersection(Object.keys(this.$store.state.route.query), Object.keys(this.search.fields))
    },
    searchValuesFromRoute () {
      return _.pick(this.$store.state.route.query, this.searchFieldsFromRoute)
    },
    searchFiltersFromRoute () {
      return _.pick(this.$store.state.route.query, _.without(Object.keys(this.$store.state.route.query), this.searchFieldsFromRoute))
    }
  },

  watch: {
    /**
     * On route query param change update the search state
     * if in the Search route update the search input and re-submit search.
     *
     * @param  {object} val new route query parameters
     * @return {void}
     *
     * @since 0.2.7
     */
    '$route.query': function (val) {
      if (_.difference([val.freetext], [this.$store.state.search.fields.freetext]).length) {
        val.zip = null
        val.address = null
      }
      this.searchFromRoute(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-search{
  width: 100%;
  display: flex;
  flex-direction: row;
  max-width: 998px;
  margin: auto;
  border-radius: $border-radius;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
  transition: box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  overflow: hidden;
  &:hover{
    box-shadow: $box-shadow;
  }
}

  .field--freetext{
    max-width: 650px;
    //display:block;
    flex: 3;
    border-right: 1px solid $black;
  }

  .field--address{
    max-width: 358px;
    //display:block;
    flex: 2;
  }

  #pprf-search__submit{
    min-width: 40px;
    background: color(ben-franklin-blue);
    &[disabled] {
      background: color(sidewalk);
    }
    .fa-search{
      color:$white;
    }
  }


  @include breakpoint(medium down) {
    .pprf-search {
      box-shadow: none;
      &:hover{ box-shadow: none;}
      .field--freetext{ max-width: 100%; border-right: none; }
      .field--address{ display: none; }
    }
  }
</style>
