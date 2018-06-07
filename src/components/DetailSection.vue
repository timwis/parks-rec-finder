<template>
  <div class="detail-section">
    <h4>
      <i
        v-if="icon"
        :class="iconClass"
        class="fa-fw"/>
      {{ title }}
    </h4>
    <div :class="{'is-indented': isIndented}"><slot/></div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    isIndented: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    iconClass () {
      if (!this.icon) return null
      return `fa fa-${this.icon}`
    }
  }
}
</script>

<style lang="sass">
.detail-section
  margin-bottom: 2rem

.is-indented
  margin-left: 2rem

  .detail
    margin-left: 0
</style>
