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

      <fieldset @change="onChange">
        <legend class="h4">Show programs on these days</legend>

        <input type="checkbox" id="sunday" value="Sunday" v-model="filters.days">
        <label for="sunday">Sunday</label>

        <input type="checkbox" id="monday" value="Monday" v-model="filters.days">
        <label for="monday">Monday</label>

        <input type="checkbox" id="tuesday" value="Tuesday" v-model="filters.days">
        <label for="tuesday">Tuesday</label>

        <input type="checkbox" id="wednesday" value="Wednesday" v-model="filters.days">
        <label for="wednesday">Wednesday</label>

        <input type="checkbox" id="thursday" value="Thursday" v-model="filters.days">
        <label for="thursday">Thursday</label>

        <input type="checkbox" id="friday" value="Friday" v-model="filters.days">
        <label for="friday">Friday</label>

        <input type="checkbox" id="saturday" value="Saturday" v-model="filters.days">
        <label for="saturday">Saturday</label>
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
      filters: {
        cost: null,
        gender: null,
        days: [],
        ...this.value
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
