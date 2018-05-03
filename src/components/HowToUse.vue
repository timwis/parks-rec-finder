<template>
  <div
    v-if="visibility"
    class="overlay">
    <section class="how-to-use">
      <button
        class="close-button"
        @click="close">
        <font-awesome-icon
          icon="times" />
      </button>
      <h2 class="text-center ">How to use the finder</h2>
      <div class="modal-content">
        <p>There are two ways to use the finder.</p>
        <div>
          <font-awesome-icon
            icon="search"/>
          <b>Search by entering an activity, location, or ZIP code into the search box.</b>
          <p>
            The finder will return results that match what you put input.</p>
        </div>
        <div>
          <font-awesome-icon
            icon="image"/>
          <b>Browse by Category.</b>
          <p>Select one of the pictured categories.</p>
        </div>
        <p>Once you get results, you can <b><i class="fa-xs fa-filter fa"/> filter</b> by age, fee, gender, and day of week to narrow down your search.</p>
      </div>
    </section>
  </div>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'HowToUse',
  components: {
    FontAwesomeIcon
  },
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close (event) {
      this.$emit('close')
    }
  }
}
</script>
<style lang="sass" scoped>
.overlay
  width: 100%
  height: 100%
  position: absolute
  top: 0
  background: rgba(0, 0, 0, .5)
  z-index: 20000

.how-to-use
  background: white
  width: 50%
  margin: 0 auto
  padding: 2rem
  color: #444
  @media screen and (max-width: 39.9375em)
    width: 100%
    padding: 1rem
    height: 100%

.close-button
  float: right

</style>
