<template>
  <header class="site-header app grid-x grid-padding-x align-middle">

    <div class="logo-container cell shrink show-for-large">
      <a
        class="logo"
        href="https://beta.phila.gov/departments/parks-recreation/">
        <img
          src="../assets/parks-rec-logo.png"
          alt="City of Philadelphia">
      </a>
    </div>

    <div class="app-divide cell shrink show-for-large"/>

    <div class="page-title-container cell shrink">
      <a
        class="mobile-menu-toggle hide-for-large"
        @click.prevent="toggleMobileMenu">
        <i class="fa fa-bars fa-2x"/>
      </a>
      <router-link to="/">
        <h1 class="page-title">
          Finder
        </h1>
        <h2 class="page-subtitle">
          Search for activities, locations, or zip codes.
        </h2>
      </router-link>
    </div>

    <div class="search-container cell large-auto small-24">

      <form
        role="search"
        @submit.prevent="onSubmit">
        <div class="grid-x align-right-large">
          <input
            ref="searchTerm"
            :value="searchTerm"
            class="bdr-right cell auto"
            type="search"
            placeholder="Search by activity or location name"
            data-testid="searchTerm">
          <input
            ref="searchLocation"
            :value="searchLocation"
            class="cell small-10"
            type="search"
            placeholder="Address or zip code"
            data-testid="searchLocation">
          <button
            type="submit"
            class="cell button small-2">
            <i class="fa fa-search fa-lg"/>
          </button>
        </div>
      </form>

    </div>
    <div
      v-show="mobileMenuOpen"
      class="mobile-menu hide-for-large">
      <a
        class="logo"
        href="https://beta.phila.gov/departments/parks-recreation/">
        <img
          src="../assets/parks-rec-logo.png"
          alt="City of Philadelphia">
      </a>
      <nav>
        <ul>
          <li>
            <a href="http://beta.phila.gov">City of Philadelphia</a>
          </li>
          <li>
            <a @click.prevent="toggleHowToUse">How to use</a>
          </li>
          <li>
            <a
              href="javascript:void(window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500'))"
              class="link-dark-bg text-upper">Feedback
            </a>
          </li>
        </ul>
      </nav>
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
  data: function () {
    return {
      mobileMenuOpen: false,
      howToUseOpen: false
    }
  },
  methods: {
    toggleMobileMenu () {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    toggleHowToUse () {
      this.howToUseOpen = !this.howToUseOpen
    },
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
  font-size: 1rem
.bdr-right
  border-right: 1px solid #444
#application
  .site-header
    .logo
        img
          max-width: 200px
    .app-divide
      min-height: 5rem
      margin: 0
    .page-title-container h1
      font-size: 2rem
.mobile-menu-toggle
  color: white

.mobile-menu
  width: 100%
  height: 100vh

.page-title
  font-weight: bold
.page-subtitle
  font-weight: normal
</style>
