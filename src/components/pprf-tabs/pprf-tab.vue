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
  },

  watch: {
    'isActive': {
      handler (val) {
        // @TODO: set focus on the first heading (h3 || h4) when tab is active
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.pprf-tab-panel{

}
</style>
