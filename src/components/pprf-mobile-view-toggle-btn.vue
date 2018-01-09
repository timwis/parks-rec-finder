<template>
  <button @click="toggleView" class="pprf-btn pprf-sidebar--mobile-view-btn" >
       <font-awesome-icon :icon="listView ? 'map' : 'list-ul'" /> {{listView ? 'Map' : 'List'}} View
  </button>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import {mapState} from 'vuex'
export default {
  name: 'PPRF-Mobile-View-Toggle-Btn',
  components: {FontAwesomeIcon},
  computed: {
    ...mapState({
      'listView': state => state.mobile.listView
    })
  },
  methods: {
    toggleView () {
      this.$store.dispatch('setMobileView', this.listView ? 'map' : 'list')
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-sidebar--mobile-view-btn{display: none;}
@include breakpoint (medium down) {
  .pprf-sidebar--mobile-view-btn{
    display: block;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px;
    color: $black;
    z-index: 1000;
    background: lighten(color(light-ben-franklin), 10%);
  }
}
</style>
