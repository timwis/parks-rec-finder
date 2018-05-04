<template>
  <div
    :class="{ open: isOpen }"
    class="filter-controls cell">
    <a
      data-testid="filterButton"
      class="button cell filter-button"
      @click="isOpen = !isOpen">
      <font-awesome-icon
        icon="filter"/>
      Filters
      <span
        v-if="!isOpen"
        class="float-right">
        <font-awesome-icon
          icon="plus"/>
      </span>
      <span
        v-else
        class="float-right">
        <font-awesome-icon
          icon="minus"/>
      </span>
    </a>
    <div
      v-show="isOpen"
      data-testid="filterControls"
      class="overlay cell">
      <div class="filter-content">
        <div class="grid-x">
          <div class="cell small-12">
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
          </div>
          <div class="cell small-12">
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
              <div class="columns">
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
              </div>
            </fieldset>
          </div>
        </div>
        <button
          class="button"
          @click="isOpen = !isOpen">
          Close
        </button>
        <button
          v-if="activeFiltersCount > 0"
          class="button mlm"
          data-testid="resetFilterButton"
          @click="removeAllFilters">
          Reset filters
        </button>
      </div>
    </div>
    <div
      v-show="!isOpen && activeFiltersCount > 0"
      data-testid="activeFilters"
      class="active-filters">
      <span
        v-if="filters.cost"
        class="label">
        <a @click="removeFilter('cost')">
          <font-awesome-icon
            icon="times"/></a>
        Cost: {{ filters.cost }}
      </span>
      <span
        v-if="filters.age"
        class="label">
        <a @click="removeFilter('age')">
          <font-awesome-icon
            icon="times" />
        </a>
        Age: {{ filters.age }}
      </span>
      <span
        v-if="filters.gender"
        class="label">
        <a @click="removeFilter('gender')">
          <font-awesome-icon
            icon="times" />
        </a>
        Gender: {{ filters.gender }}
      </span>
      <span
        v-if="filters.days.length > 0"
        class="label">
        <a @click="removeFilter('days')">
          <font-awesome-icon
            icon="times" />
        </a>
        Days: {{ filters.days.join(', ') }}
      </span>
    </div>
  </div>
</template>

<script>
import { removeEmptyKeys } from '~/util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  components: {
    FontAwesomeIcon
  },
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
      this.isOpen = false
    }
  }
}
</script>
<style lang="sass" scoped>
.filter-controls.open
  position: absolute
  z-index: 20
  top: 3.8rem
  bottom: 0
  width: 100%
.overlay
  background: #f0f0f0
  height: 100vh
  color: #444
  padding: 0 1rem 1rem 1rem
  overflow-y: scroll
  position: absolute
.h4
  padding: 1rem 0 0 0
[type='checkbox'] + label, [type='radio'] + label
  display: block
.filter-button
  background: $secondary
  text-align: left
.filter-content
  height: calc(100vh + 12rem)
.active-filters
  background: white
  padding: 0 1rem 1rem 1rem
.fa-times
  color: white
</style>
