<template>
    <form @submit.prevent="onSubmit" class="pprf-search">
      <phila-text-field
        name="pprf-search-freetext"
        placeholder="SEARCH BY ACTIVITY TYPE OR LOCATION NAME"
      ></phila-text-field>
      <phila-text-field
        name="pprf-search-address"
        placeholder="ADDRESS OR ZIPCODE"
      ></phila-text-field>
      <phila-button
        id="pprf-search-submit-btn"
      >
      </phila-button>
    </form>
</template>

<script>
import PhilaTextField from '@/components/phila/phila-text-field'
import PhilaButton from '@/components/phila/phila-button'
export default {
  name: 'PPRF-Search',
  components: {
    PhilaTextField,
    PhilaButton
  },
  data () {
    return {

    }
  },
  methods: {
    onSubmit () {
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
  }
</style>
