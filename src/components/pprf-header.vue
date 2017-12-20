<template>
  <header class="pprf-header">
    <p class="version-tag">v{{versionNumber}}</p>
    <pprf-search></pprf-search>
  </header>
</template>

<script>
import pprfSearch from '@/components/search/pprf-search'
import {version} from '../../package.json'
/**
 * HEADER BAR
 *
 * Contains Search Input components
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Header',
  components: {pprfSearch},
  data () {
    return {
      versionNumber: version
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-header{
  display:block;
  position:relative;

  width: 100%;
  height: $header-height;

  padding:10px;

  background: color(dark-ben-franklin);

}
.version-tag{
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 10px;
  color: $white;
}
</style>
