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
    <a
      class="mobile-menu-toggle hide-for-large cell shrink"
      @click.prevent="toggleMobileMenu">
      <font-awesome-icon
        icon="bars"
        size="2x"/>
    </a>

    <div class="page-title-container cell shrink">
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
            class="cell small-9 medium-10"
            type="search"
            placeholder="Address or zip code"
            data-testid="searchLocation">
          <button
            type="submit"
            class="cell button small-3 medium-2 submit">
            <font-awesome-icon
              icon="search"
              size="lg"
              fixed-width/>
          </button>
        </div>
      </form>

    </div>
    <div
      v-show="mobileMenuOpen"
      class="mobile-menu hide-for-large">
      <div class="center mtm">
        <a
          class="logo"
          href="https://beta.phila.gov/departments/parks-recreation/">
          <img
            src="../assets/parks-rec-logo.png"
            alt="City of Philadelphia">
        </a>
      </div>
      <nav>
        <ul class="no-bullet">
          <li>
            <a href="http://beta.phila.gov">City of Philadelphia</a>
          </li>
          <li>
            <a
              href=""
              @click.prevent="showModal">How to use</a>
          </li>
          <li>
            <a
              href=""
              class="link-dark-bg text-upper"
              @click.prevent="feedbackPopup">Feedback
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <HowToUse
      :visibility="isModalVisible"
      @close="closeModal"/>
  </header>
</template>

<script>
import HowToUse from './HowToUse'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  components: {
    HowToUse,
    FontAwesomeIcon
  },
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
      isModalVisible: false
    }
  },
  methods: {
    toggleMobileMenu () {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    showModal () {
      this.isModalVisible = !this.isModalVisible
    },
    closeModal () {
      this.isModalVisible = false
    },
    onSubmit (event) {
      this.mobileMenuOpen = false
      const searchTerm = this.$refs.searchTerm.value
      const searchLocation = this.$refs.searchLocation.value
      const isSearchValid = (searchTerm.length > 0 || searchLocation.length > 0)
      if (isSearchValid) {
        this.$emit('search', { searchTerm, searchLocation })
      }
    },
    feedbackPopup () {
      return window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500')
    }
  }
}
</script>

<style lang="sass" scoped>
input[type="search"]
  margin-bottom: 0
  font-size: 1rem

  @media screen and (max-width: 39.9375em)
    font-size: .85rem

.bdr-right
  border-right: 1px solid #444

.page-title
  font-weight: bold

.page-subtitle
  font-weight: normal

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

// clean up display on very small screens
@media screen and (max-width: 39.9375em)
  #application
    .site-header
      padding: .5rem 0

      .page-title-container
        margin-bottom: .5rem
        margin-left: 0

        h2
          font-size: .85rem

// account for extremely small screens > 360px wide
@media screen and (max-width: 25.71rem)
  .page-title-container a
    max-width: 17.86rem

.mobile-menu-toggle
  color: white

.mobile-menu
  width: 100%
  height: 100vh

  a:link, a:visited
    color: white
    text-transform: uppercase

  a:hover, a:active
    color: #25cef7

  ul
    margin-top: 2rem
    border-top: 1px solid white

    li
      border-bottom: 1px solid white
      padding: 1rem

.submit
  height: 38px

  @media screen and (max-width: 39.9375em)
    height: 39px
</style>
