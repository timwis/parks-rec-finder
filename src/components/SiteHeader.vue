<template>
  <header class="site-header app group">
    <div class="row expanded">
      <div class="columns">
        <a class="logo" href="https://beta.phila.gov/departments/parks-recreation/">
          <img
            src="http://standards.phila.gov/img/logo/city-of-philadelphia-yellow-white.png"
            alt="City of Philadelphia"
          />
        </a>
        <div class="app-divide"/>
        <div class="page-title-container">
          <router-link to="/">
            <h1 class="page-title">
              Finder
            </h1>
            <h2 class="page-subtitle">
              Search for activities, locations, or zip codes.
            </h2>
          </router-link>
        </div>
        <div class="app-buttons">
          <form role="search" @submit.prevent="onSubmit">
            <div class="search">
              <input
                class="search-field"
                type="text"
                placeholder="Search by activity or location name"
                name="term"
                ref="term"
              />
              <input type="submit" class="search-submit"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    onSubmit (event) {
      const term = this.$refs.term.value
      if (term.length > 0) {
        this.$emit('search', { term })
      }
    }
  }
}
</script>
