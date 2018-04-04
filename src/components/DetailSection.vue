<template>
  <div class="detail-section">
    <h4>
      <i
        v-if="icon"
        :class="iconClass"/>
      {{ title }}
    </h4>
    <slot/>
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

<style lang="sass" scoped>
.detail-section
  margin-bottom: 10px
</style>
