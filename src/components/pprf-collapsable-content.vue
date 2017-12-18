<template>
  <div :class="['pprf-collapse-content', {'pprf-collapse-content--open': open}]">
    <div class="pprf-collapse-content--header" @click="open = !open">
      <h4 class="text-nopad">{{title}}</h4>
      <font-awesome-icon :icon="icon" />
    </div>
    <div v-show="!open" class="pprf-collapse-content--panel">
      <slot/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {

  name: 'PPRF-Collapsable-Content',
  components: {FontAwesomeIcon},
  props: {
    title: {
      type: String
    }
  },

  data () {
    return {
      open: false
    }
  },
  computed: {
    icon () {
      return (this.open ? 'minus' : 'plus')
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-collapse-content{
  width: 100%;
  color: $black;
  display: block;
  position:relative;
  z-index:5;
  border-top: 1px solid $white;
}

.pprf-collapse-content--header{
  background: lighten(color(light-ben-franklin), 10%);
  h4{display:inline; marign-bottom:0; padding-bottom:0;}
  .svg-inline--fa{
    margin:2% 2% 0 2%;
    float:right;
  }
}
</style>
