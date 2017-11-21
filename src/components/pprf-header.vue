<template>
    <header class="pprf-header">
        <pprf-search
          @submit="onSearchSubmit"
          :prefillValues="searchPrefill"
        ></pprf-search>
    </header>
</template>

<script>
import pprfSearch from '@/components/search/pprf-search'
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
  props: ['onSearchSubmit', 'searchPrefill']
}
</script>

<style lang="scss" scoped>
.pprf-header{
    display:block;
    position:relative;

    width: 100%;
    height: 63px;

    padding:10px;

    background: color(dark-ben-franklin);

}
</style>
