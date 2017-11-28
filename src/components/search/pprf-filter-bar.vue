<template>
  <section class="pprf-filter-bar">
    <header
      class="pprf-filter-bar-header"
      @click="open = !open"
    >
      <h4 class="text-nopad">Filters</h4>
      <font-awesome-icon :icon="icon" />
    </header>
    <form
      :class="[{'pprf-filter-bar-form__open':open}, 'pprf-filter-bar-form', 'pprf-filter-bar-form__open']"
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
            :value="false"
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
            :value="true"
            @change="onInput"
          >
          <label class="field-label field-label__inline" for="fee">Fee</label>
        </div>

      </fieldset>


       <fieldset class="pprf-filter-bar-form--fieldset">

        <legend>Age Range {{age_range.low}} - {{age_range.high}}</legend>

        <div
          class="field field__inline field-age"
          v-for="ageGroup in ageGroups"
        >
          <input
            id="age"
            type="checkbox"
            :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()"
            :value="ageGroup.range"
            @change="updateAgeRange($event.target.value)"
          >
          <label class="field-label field-label__inline" :name="'age__'+ageGroup.name.split(' ')[0].toLowerCase()">{{ageGroup.name}}</label>
        </div>

      </fieldset>




      <footer class="pprf-filter-bar-footer">

        <phila-button @click="open = false">
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
          range: [99]
        }
      ],
      ages: [],
      filters: {
        fee: null,
        gender: [],
        time_of_week: {mon: null, tues: null, wed: null, thurs: null, frid: null, sat: null, sun: null},
        program_dates: {
          start: null,
          end: null
        }
      }
    }
  },

  computed: {
    age_range () {
      return {
        low: Math.min.apply(Math, this.ages),
        high: Math.max.apply(Math, this.ages)
      }
    },

    icon () {
      return (this.open ? 'minus' : 'plus')
    }
  },

  methods: {
    onInput () {
      const _filters = {filters: Object.assign({}, this.filters, {age_range: this.age_range})}
      this.$store.dispatch('updateSearchInput', _filters)
    },
    onSubmit () {
      const _filters = {filters: Object.assign({}, this.filters, {age_range: this.age_range})}
      this.$store.dispatch('submitSearch', _filters)
    },
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

.pprf-filter-bar-form{
  width: 100%;
  position: absolute;
  background: color(ghost-gray);
  top: 40;
  left: 0;
  overflow:hidden;
}

.pprf-filter-bar-form__open{
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
