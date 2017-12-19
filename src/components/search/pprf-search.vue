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
        placeholder="ADDRESS OR ZIPCODE"
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
 * Form and inputs to search by freetext and/or address or zipcode
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Search',
  props: ['prefillValues'],
  components: {
    PhilaTextField,
    PhilaButton,
    FontAwesomeIcon
  },

  data () {
    return {
      isDisabled: true,

      search: {
        fields: {
          freetext: null,
          address: null,
          zip: null
        }
      }

    }
  },

  mounted () {
    let searchFieldsFromRoute = _.intersection(Object.keys(this.$store.state.route.query), Object.keys(this.search.fields))

    if (searchFieldsFromRoute.length > 0) {
      let fields = _.pick(this.$store.state.route.query, searchFieldsFromRoute)
      this._updateInputRefsValues(this.$store.state.route.query)
      this.$store.dispatch('updateSearchInput', {fields})
    }

    let searchFiltersFromRoute = _.intersection(Object.keys(this.$store.state.route.query), Object.keys(this.$store.state.search.filters))

    if (searchFiltersFromRoute.length > 0) {
      let filters = _.pick(this.$store.state.route.query, searchFiltersFromRoute)
      this.$store.dispatch('updateSearchInput', {filters})
    }

    // search if deep linked to Seach page
    if (this.$store.state.route.from && !this.$store.state.route.from.name) {
      this.$store.dispatch('submitSearch')
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
     * Sets local search field state
     * @param  {string} freetextVal user input
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    onFreetextInput (freetextVal) {
      this.search.fields.freetext = freetextVal
      // this.$store.dispatch('updateSearchInput', this.search)
    },
    /**
     * Validates the address field input as either
     * an address or a zipcode and sets the appropriate
     * search field state accordingly
     * @param  {sring | number} addressVal address address or zipcode value
     * @return {viod}
     *
     * @public
     * @since 0.0.0
     */
    onAddressInput (addressVal) {
      if (this._isValidZip(addressVal)) {
        this.search.fields.zip = parseInt(addressVal)
        this.search.fields.address = null
      } else {
        this.search.fields.address = addressVal !== '' ? addressVal : null
        this.search.fields.zip = null
      }
      // this.$store.dispatch('updateSearchInput', this.search)
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
     * @since 0.0.0
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
      this.updateSearchRouteParams(this.search.fields)
      this.$emit('submit', newSearch.fields)
      // this.$store.dispatch('submitSearch', newSearch)
    },

    /**
     * regex test a for zipcode structure
     * @param  {number}  zipcodeVal zipcode to validate
     * @return {boolean}            true if is valid; false if not
     *
     * @since 0.0.0
     */
    _isValidZip (zipcodeVal) {
      return (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcodeVal))
    },
    /**
      * if url query params are give update the input
      * fields to reflect those values
      * NOTE: does not update local state
      * @param  {object} fieldValues query parameter object
      * @return {void}
      *
      * @since 0.0.0
      */
    _updateInputRefsValues (fieldValues = this.$store.state.route.query) {
      if (fieldValues.freetext) {
        this.isDisabled = false
        this.$refs.freetextField.inputValue = fieldValues.freetext
      }
      if (fieldValues.address || fieldValues.zip) {
        this.isDisabled = false
        this.$refs.addressField.inputValue = fieldValues.address || fieldValues.zip
      }
      this.$store.dispatch('updateSearchInput', fieldValues)
    },

    /**
     * give a route params oject to match that matches the local state search fields
     * udpate the search route url to include those params in order to allow for deeplinking
     *
     * @param  {Object} queryParams query params  bject matching the local state serch fields object
     * @return {void}
     *
     * @public
     * @since 0.0.0
     */
    updateSearchRouteParams (queryParams) {
      // merge with current search params
      let query = Object.assign({}, this.$store.state.route.query, queryParams)
      // only submit submit valid params
      query = _.omit(query, val => _.isNull(val))
      this.$router.push({path: '/search', query})
    }
  },
  watch: {
    // update search on route change
    '$route.query': function (val) {
      let searchFieldsFromRoute = _.intersection(Object.keys(val), Object.keys(this.$store.state.search.fields))
      let filterDefs = Object.keys(this.$store.state.search.filters).concat('ages')
      let searchFiltersFromRoute = _.intersection(Object.keys(val), filterDefs)

      if ([...searchFieldsFromRoute, ...searchFiltersFromRoute].length && this.$store.state.route.name === 'Search') {
        let fields = _.pick(val, searchFieldsFromRoute)

        this.$store.dispatch('updateSearchInput', {fields})
        this.$store.dispatch('submitSearch')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-search{
  display: flex;
  flex-direction: row;
  max-width: 998px;
  margin: auto;
  border-radius: 2px;
  background: color(ben-franklin-blue);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
  transition: box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  overflow: hidden;
  &:hover{
    box-shadow: $box-shadow;
  }
}

  .field--freetext{
    max-width: 650px;
    display:block;
    flex: 3;
    border-right: 1px solid $black;
  }

  .field--address{
    max-width: 358px;
    display:block;
    flex: 2;
  }

  #pprf-search__submit{
    min-width: 40px;

    .fa-search{
      color:$white;
    }
  }
</style>
