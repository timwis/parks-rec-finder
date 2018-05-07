<template>
  <div>
    <HowToUse
      :visibility="isModalVisible"
      @close="closeModal" />
    <footer class="app-footer show-for-large">
      <nav>
        <ul class="inline-list">
          <li>
            <a
              href="http://beta.phila.gov"
              class="link-dark-bg text-upper">City of Philadelphia</a>
          </li>
          <li>
            <a
              href=""
              class="link-dark-bg text-upper"
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
    </footer>
  </div>
</template>
<script>
import HowToUse from './HowToUse'

export default {
  components: {
    HowToUse
  },
  data: function () {
    return {
      mobileMenuOpen: false,
      isModalVisible: false
    }
  },
  methods: {
    toggleHowToUse () {
      this.howToUseOpen = !this.howToUseOpen
    },
    showModal () {
      this.isModalVisible = !this.isModalVisible
    },
    closeModal () {
      this.isModalVisible = false
    },
    feedbackPopup () {
      return window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500')
    }
  }
}
</script>

<style lang="sass" scoped>
.app-footer
  position: fixed
  bottom: 0
  z-index: 50000
  text-transform: uppercase

  nav ul
    margin-left: 0

    li
      border-left-color: white !important
</style>
