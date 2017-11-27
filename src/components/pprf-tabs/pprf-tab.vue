<template >
    <div
      v-show="isActive"
      class="pprf-tab-panel"
      :aria-hidden="[isActive ? true : false]"
      :aria-labelledby="name.toLowerCase().replace(/ /g,'-').trim()"
    >
        <slot/>
    </div>
</template>

<script>

/**
 * Single Tab to be nested in pprf-tabs component
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Tab',

  props: {
    /**
     * Name that shows as tab and is slugified as url hash
     *
     * @since 0.0.0
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Active tab status
     *
     * @since 0.0.0
     */
    selected: {
      type: Boolean,
      default: false
    },
    /**
     * Number of resource in tab
     *
     * @since 0.0.0
     */
    count: {
      type: Number
    }
  },

  data () {
    return {
      isActive: false
    }
  },

  mounted () {
    // bind to prop so we can mutate it
    this.isActive = this.selected
    if (this.isActive) {
      // this.$store.dispatch('setActiveTab', this.name)
    }
  }

}
</script>

<style lang="scss" scoped>
.pprf-tab-panel{

}
</style>
