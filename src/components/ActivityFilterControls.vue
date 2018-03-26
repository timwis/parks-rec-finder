<template>
  <div>
    <button @click="isOpen = !isOpen">Filters</button>
    <div v-show="isOpen">
      <fieldset @change="onChange">
        <legend class="h4">Cost</legend>

        <input type="radio" id="all-costs" name="cost" value="" v-model="filters.cost">
        <label for="all-costs">All costs</label>

        <input type="radio" id="free" name="cost" value="free" v-model="filters.cost">
        <label for="free">Free</label>
      </fieldset>

      <fieldset @change="onChange">
        <legend class="h4">Gender</legend>

        <input type="radio" id="all-genders" name="gender" value="" v-model="filters.gender">
        <label for="all-genders">All genders</label>

        <input type="radio" id="male" name="gender" value="male" v-model="filters.gender">
        <label for="male">Male</label>

        <input type="radio" id="female" name="gender" value="female" v-model="filters.gender">
        <label for="female">Female</label>
      </fieldset>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  model: {
    event: 'change'
  },
  data () {
    return {
      isOpen: false,
      filters: this.value || {
        cost: null,
        gender: null
      }
    }
  },
  methods: {
    onChange (event) {
      this.$emit('change', this.filters)
    }
  }
}
</script>
