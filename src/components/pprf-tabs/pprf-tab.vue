<template >
    <div class="pprf-tab">
        <h2>tab</h2>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'PPRF-Tab',

  props: {
    name: {required: true},
    selected: {default: false}
  },

  data () {
    return {
      isActive: false
    }
  },

  mounted () {
    this.isActive = this.selected
  }

}
</script>

<style lang="scss" scoped>
.pprf-tab{
    border:1px solid red;
}
</style>
