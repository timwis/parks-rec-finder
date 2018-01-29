<template>
  <footer class="pprf-footer">
    <a class="text-upper" href="http://beta.phila.gov">City of Philadelphia</a> |
    <a @click.prevent="toggleModal('about')" class="text-upper" href="">How to use</a> |
    <a class="text-upper" href="javascript:void(window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500'))">
      Feedback
    </a>
    <small id="versionNumber" class="text-nopad">v{{version}}</small>
  </footer>
</template>

<script>
import {version} from '../../package.json'

export default {

  name: 'PPRR-Footer',

  data () {
    return {
      version
    }
  },
  methods: {
    toggleModal (name) {
      if (!this.$store.state.modals.about.open) {
        this.$router.push('/activities')
      }
      this.$store.dispatch('toggleModal', {name, open: null})
    }
  }
}
</script>

<style lang="scss" scoped>

.pprf-footer{
  width: 100%;
  height: $footer-height;
  display:inline-block;
  text-align: center;
  position: fixed;
  bottom: 0;
  left:0;
  z-index: 50000;
  justify-content: space-around;
  align-items: baseline;
  background: color(dark-ben-franklin);
  color: $white;
  a{
    color: $white !important;
    text-decoration: none;
    font-weight: 700;
    padding: 0 10px;
  }
}

#versionNumber{
  position: absolute;
  right: 15px;
  top: 5px;
}

@include breakpoint(medium down) {
  .pprf-footer{
    display: none;
  }
}
</style>
