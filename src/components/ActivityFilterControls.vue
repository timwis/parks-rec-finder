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
        <legend class="h4">Age range</legend>

        <input type="radio" id="tots" name="age" value="2-5" v-model="filters.age">
        <label for="tots">Tots (2-5 or younger)</label>

        <input type="radio" id="youth" name="age" value="6-12" v-model="filters.age">
        <label for="youth">Youth (6-12)</label>

        <input type="radio" id="teen" name="age" value="13-19" v-model="filters.age">
        <label for="teen">Teen (13-19)</label>

        <input type="radio" id="adult" name="age" value="20-55" v-model="filters.age">
        <label for="adult">Adult (20-55)</label>

        <input type="radio" id="senior" name="age" value="56-" v-model="filters.age">
        <label for="senior">Senior (56+)</label>
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
    currentFilters: Object
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
  methods: {
    onChange (event) {
      this.$emit('change', this.filters)
    }
  }
}
</script>
