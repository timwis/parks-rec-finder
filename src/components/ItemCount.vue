<template>
  <div
    class="item-count">
    <div
      class="icon">
      <font-awesome-icon
        :icon="icon" /></div>
    <span data-testid="count">{{ count }}</span>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  computed: {
    icon () {
      return faMapMarkerAlt
    }
  }
}
</script>
<style lang="sass" scoped>
.item-count
  position: absolute
  top: 1rem
  right: 1rem
  padding: .5rem 1rem
  z-index: 9
  background: white
  color: #444
  .icon
    display: inline-block
    padding: 0 1rem 0 0
</style>
