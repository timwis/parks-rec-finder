<template>
  <button @click="toggleView" class="pprf-btn pprf-sidebar--mobile-view-btn" >
       <font-awesome-icon :icon="listView ? 'list-ul' : 'map'" /> {{listView ? 'List' : 'Map'}} View
  </button>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import {EventBus} from '@/event-bus'
export default {
  name: 'PPRF-Mobile-View-Toggle-Btn',
  components: {FontAwesomeIcon},
  data () {
    return {
      listView: false
    }
  },
  methods: {
    toggleView () {
      this.listView = !this.listView
      EventBus.$emit('mobileView:toggle')
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-sidebar--mobile-view-btn{display: none;}
@include breakpoint (medium down) {
  .pprf-sidebar--mobile-view-btn{
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background: lighten(color(light-ben-franklin), 10%);
  }
}
</style>
