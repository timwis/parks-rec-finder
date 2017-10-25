<template>
    <header class="pprf-header">
        <pprf-search-container></pprf-search-container>
    </header>
</template>

<script>
import PprfSearchContainer from '@/components/search/pprf-search-container'
/**
 * HEADER BAR
 *
 * Contains Search Input components
 *
 * @since 0.0.0
 */
export default {
  name: 'PprfHeader',
  components: {
    PprfSearchContainer
  }
}
</script>

<style lang="scss" scoped>
.pprf-header{

    display:block;
    position:relative;

    width: 100%;
    height: 63px;

    background: color(dark-ben-franklin);

}
</style>
