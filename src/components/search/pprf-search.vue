<template>
    <form
      class="pprf-search"
      @submit.prevent="onSubmit"
    >

      <phila-text-field
        name="pprf-search-freetext"
        placeholder="SEARCH BY ACTIVITY TYPE OR LOCATION NAME"
        ref="freetextField"
        @input="onFreetextInput"
      ></phila-text-field>

      <phila-text-field
        name="pprf-search-address"
        placeholder="ADDRESS OR ZIPCODE"
        @input="onAddressInput"
        ref="addressField"
      ></phila-text-field>

      <phila-button
        id="pprf-search-submit-btn"
        :disabled="isDisabled"
        tabindex="3"
      >
        <font-awesome-icon
          icon="search"
          size="lg"
        />
      </phila-button>

    </form>
</template>

<script>
import router from '@/router'
import store from '@/store'
import PhilaTextField from '@/components/phila/phila-text-field'
import PhilaButton from '@/components/phila/phila-button'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

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
    if (store.state.route.query) {
      this._updateInputRefsValues(store.state.route.query)
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

    onFreetextInput (freetextVal) {
      this.search.fields.freetext = freetextVal
    },

    onAddressInput (addressVal) {
      // let isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(addressVal)
      if (this._isValidZip(addressVal)) {
        this.search.fields.zip = parseInt(addressVal)
        this.search.fields.address = null
      } else {
        this.search.fields.address = addressVal
        this.search.fields.zip = null
      }
    },

    onSubmit (e) {
      this._updateRouteParams(this.$data.search.fields)
      // @TODO: investigate the connection between local state and Vuex via actions
      const _fields = this.$data.search.fields
      let newSearch = {
        fields: {
          freetext: _fields.freetext,
          address: _fields.address,
          zip: _fields.zip
        }
      }

      this.$store.dispatch('submitSearch', newSearch)
    },

    _isValidZip (zipcodeVal) {
      return (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcodeVal))
    },

    _updateRouteParams (queryParams = {freetext: null, address: null, zip: 0}) {
      if (store.state.route.name !== 'Search') {
        router.push({path: 'search', query: queryParams})
      } else {
        router.replace({path: 'search', query: queryParams})
      }
    },

    _updateInputRefsValues (fieldValues = store.state.route.query) {
      if (fieldValues.freetext) {
        this.isDisabled = false
        this.$refs.freetextField.inputValue = fieldValues.freetext
      }

      if (fieldValues.address || fieldValues.zip) {
        this.isDisabled = false
        this.$refs.addressField.inputValue = fieldValues.address || fieldValues.zip
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
}

  .pprf-search-freetext{
    max-width: 650px;
    display:block;
    flex: 3;
    border-right: 1px solid $black;
  }

  .pprf-search-address{
    max-width: 358px;
    display:block;
    flex: 2;
  }

  #pprf-search-submit-btn{
    min-width: 40px;
    .fa-icon{ color:$white;}
  }
</style>
