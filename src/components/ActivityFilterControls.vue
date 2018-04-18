<template>
  <div class="filter-controls">
    <button
      data-testid="filterButton"
      class="filter-button"
      @click="isOpen = !isOpen">
      <i class="fa fa-filter"/>
      Filters
    </button>
    <div
      v-show="isOpen"
      data-testid="filterControls">
      <fieldset @change="onChange">
        <legend class="h4">Cost</legend>

        <input
          id="all-costs"
          v-model="filters.cost"
          type="radio"
          name="cost"
          value="">
        <label for="all-costs">All costs</label>

        <input
          id="free"
          v-model="filters.cost"
          type="radio"
          name="cost"
          value="free"
          data-testid="filterCostFree">
        <label for="free">Free</label>
      </fieldset>

      <fieldset @change="onChange">
        <legend class="h4">Age range</legend>

        <input
          id="all-ages"
          v-model="filters.age"
          type="radio"
          name="age"
          value="">
        <label for="all-ages">All ages</label>

        <input
          id="tots"
          v-model="filters.age"
          type="radio"
          name="age"
          value="2-5">
        <label for="tots">Tots (2-5 or younger)</label>

        <input
          id="youth"
          v-model="filters.age"
          name="age"
          type="radio"
          value="6-12">
        <label for="youth">Youth (6-12)</label>

        <input
          id="teen"
          v-model="filters.age"
          name="age"
          type="radio"
          value="13-19">
        <label for="teen">Teen (13-19)</label>

        <input
          id="adult"
          v-model="filters.age"
          name="age"
          type="radio"
          value="20-55">
        <label for="adult">Adult (20-55)</label>

        <input
          id="senior"
          v-model="filters.age"
          name="age"
          type="radio"
          value="56-">
        <label for="senior">Senior (56+)</label>
      </fieldset>

      <fieldset @change="onChange">
        <legend class="h4">Gender</legend>

        <input
          id="all-genders"
          v-model="filters.gender"
          name="gender"
          type="radio"
          value="">
        <label for="all-genders">All genders</label>

        <input
          id="male"
          v-model="filters.gender"
          name="gender"
          type="radio"
          value="male">
        <label for="male">Male</label>

        <input
          id="female"
          v-model="filters.gender"
          name="gender"
          type="radio"
          value="female">
        <label for="female">Female</label>
      </fieldset>

      <fieldset @change="onChange">
        <legend class="h4">Show activities on these days</legend>

        <input
          id="sunday"
          v-model="filters.days"
          type="checkbox"
          value="Sunday">
        <label for="sunday">Sunday</label>

        <input
          id="monday"
          v-model="filters.days"
          type="checkbox"
          value="Monday">
        <label for="monday">Monday</label>

        <input
          id="tuesday"
          v-model="filters.days"
          type="checkbox"
          value="Tuesday">
        <label for="tuesday">Tuesday</label>

        <input
          id="wednesday"
          v-model="filters.days"
          type="checkbox"
          value="Wednesday">
        <label for="wednesday">Wednesday</label>

        <input
          id="thursday"
          v-model="filters.days"
          type="checkbox"
          value="Thursday">
        <label for="thursday">Thursday</label>

        <input
          id="friday"
          v-model="filters.days"
          type="checkbox"
          value="Friday">
        <label for="friday">Friday</label>

        <input
          id="saturday"
          v-model="filters.days"
          type="checkbox"
          value="Saturday">
        <label for="saturday">Saturday</label>
      </fieldset>

      <button
        v-if="activeFiltersCount > 0"
        class="button"
        data-testid="resetFilterButton"
        @click="removeAllFilters">
        Reset filters
      </button>
    </div>
    <div
      v-show="!isOpen && activeFiltersCount > 0"
      data-testid="activeFilters">
      <span
        v-if="filters.cost"
        class="label">
        <a @click="removeFilter('cost')"><i class="fa fa-close"/></a>
        Cost: {{ filters.cost }}
      </span>
      <span
        v-if="filters.age"
        class="label">
        <a @click="removeFilter('age')"><i class="fa fa-close"/></a>
        Age: {{ filters.age }}
      </span>
      <span
        v-if="filters.gender"
        class="label">
        <a @click="removeFilter('gender')"><i class="fa fa-close"/></a>
        Gender: {{ filters.gender }}
      </span>
      <span
        v-if="filters.days.length > 0"
        class="label">
        <a @click="removeFilter('days')"><i class="fa fa-close"/></a>
        Days: {{ filters.days.join(', ') }}
      </span>
    </div>
  </div>
</template>

<script>
import { removeEmptyKeys } from '~/util'

export default {
  props: {
    currentFilters: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isOpen: false,
      filters: {
        cost: null,
        age: null,
        gender: null,
        days: [],
        ...this.currentFilters
      }
    }
  },
  computed: {
    activeFiltersCount () {
      const activeFilters = removeEmptyKeys(this.filters)
      return Object.keys(activeFilters).length
    }
  },
  methods: {
    onChange () {
      this.$emit('change', this.filters)
    },
    removeFilter (key) {
      // Use original default value. We could just pass `null` or `''`
      // here, but `days` needs to be an empty array for `v-model` to
      // work with the checkboxes.
      this.filters[key] = this.$options.data().filters[key]
      this.onChange()
    },
    removeAllFilters () {
      this.filters = this.$options.data().filters
      this.onChange()
    }
  }
}
</script>
<style lang="sass" scoped>
.filter-controls
  background: #f0f0f0
.filter-button
  width: 100%
</style>
