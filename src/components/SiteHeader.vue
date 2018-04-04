<template>
  <header class="site-header app grid-x align-middle">

    <div class="logo-container cell shrink">
      <a
        class="logo"
        href="https://beta.phila.gov/departments/parks-recreation/">
        <img
          src="http://standards.phila.gov/img/logo/city-of-philadelphia-yellow-white.png"
          alt="City of Philadelphia">
      </a>
    </div>

    <div class="app-divide cell shrink"/>

    <div class="page-title-container cell auto">
      <router-link to="/">
        <h1 class="page-title">
          Finder
        </h1>
        <h2 class="page-subtitle">
          Search for activities, locations, or zip codes.
        </h2>
      </router-link>
    </div>

    <div class="search-container cell medium-8">

      <form
        role="search"
        @submit.prevent="onSubmit">
        <div class="grid-x">
          <input
            ref="searchTerm"
            :value="searchTerm"
            class="cell medium-10"
            type="search"
            placeholder="Search by activity or location name">
          <input
            ref="searchLocation"
            :value="searchLocation"
            class="cell medium-10"
            type="search"
            placeholder="Address or zip code">
          <button
            type="submit"
            class="cell button shrink">
            <i class="fa fa-search valign-cell"/>
          </button>
        </div>
      </form>

    </div>
  </header>
</template>

<script>
export default {
  props: {
    searchTerm: {
      type: String,
      default: ''
    },
    searchLocation: {
      type: String,
      default: ''
    }
  },
  methods: {
    onSubmit (event) {
      const searchTerm = this.$refs.searchTerm.value
      const searchLocation = this.$refs.searchLocation.value
      const isSearchValid = (searchTerm.length > 0 || searchLocation.length > 0)
      if (isSearchValid) {
        this.$emit('search', { searchTerm, searchLocation })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
input[type="search"]
  margin-bottom: 0
</style>
