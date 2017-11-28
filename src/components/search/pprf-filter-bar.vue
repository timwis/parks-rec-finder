<template>
  <section class="pprf-filter-bar">
    <header
      class="pprf-filter-bar-header"
      @click="open = !open"
    >
      <h4 class="text-nopad">Filters</h4>
      <font-awesome-icon :icon="icon" />
    </header>
    <div class="pprf-filter-bar-shelf" :class="{'pprf-filter-bar-shelf__open':open}">

      <footer class="pprf-filter-bar-footer">

        <phila-button @click="open = false">
          Cancel
        </phila-button>

        <phila-button @click="submitFilters">
          Apply Filters
        </phila-button>

      </footer>
    </div>
  </section>
</template>

<script>
import PhilaButton from '@/components/phila/phila-button'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'PPRF-Filter-Bar',

  components: {FontAwesomeIcon, PhilaButton},

  data () {
    return {
      open: false
    }
  },

  computed: {
    icon () {
      return (this.open ? 'minus' : 'plus')
    }
  },

  methods: {
    submitFilters () {
      this.$store.dispatch('updateSearchInput', {filters: {foo: 'bar'}})
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-filter-bar{
  width: 100%;
  height: 40px;
  color: $black;
  display: block;
  position:relative;
  background: lighten(color(light-ben-franklin), 10%);
}

.pprf-filter-bar-header{
  h4{display:inline;}
  .svg-inline--fa{
    margin:2%;
    float:right;
  }
}

.pprf-filter-bar-shelf{
  width: 100%;
  position: absolute;
  background: color(ghost-gray);
  top: 40;
  left: 0;
  overflow:hidden;
}

.pprf-filter-bar-shelf__open{
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
</style>
