<template>
  <div>
    <HowToUse
      :visibility="isModalVisible"
      @close="closeModal"
    />
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
              @click.prevent="showModal"
              class="link-dark-bg text-upper">How to use</a>
          </li>
          <li>
            <a
              href="javascript:void(window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500'))"
              class="link-dark-bg text-upper">Feedback
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
  data: function () {
    return {
      mobileMenuOpen: false,
      isModalVisible: false,
    }
  },
  components: {
    HowToUse,
   },
  methods: {
    toggleHowToUse () {
        this.howToUseOpen = !this.howToUseOpen
      },
    showModal() {
      return this.isModalVisible = !this.isModalVisible

     //return this.isModalVisible = true;
   },
   closeModal() {
     this.isModalVisible = false;
   }
  }
}
</script>

<style lang="sass" scoped>
.app-footer
  text-transform: uppercase
  nav
    ul
      margin-left: 0
      li
        border-left-color: white !important
</style>
