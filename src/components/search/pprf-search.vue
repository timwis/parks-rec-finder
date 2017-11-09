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
        <icon name="search" label="Search for Programs and Loactions"></icon>
      </phila-button>

    </form>
</template>

<script>
import PhilaTextField from '@/components/phila/phila-text-field'
import PhilaButton from '@/components/phila/phila-button'
import 'vue-awesome/icons/search'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'PPRF-Search',
  components: {
    PhilaTextField,
    PhilaButton,
    Icon
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
      let isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(addressVal)
      if (isValidZip) {
        this.search.fields.zip = parseInt(addressVal)
        this.search.fields.address = null
      } else {
        this.search.fields.address = addressVal
        this.search.fields.zip = null
      }
    },

    onSubmit (e) {
      // @TODO: investigate the connection between local state and Vuex via actions
      let _fields = this.$data.search.fields
      let newSearch = {
        fields: {
          freetext: _fields.freetext,
          address: _fields.address,
          zip: _fields.zip
        }
      }

      this.$store.dispatch('submitSearch', newSearch)
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
