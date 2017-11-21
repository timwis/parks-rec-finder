<template>

  <div id="pprf-app-container" >

    <pprf-header-container></pprf-header-container>

    <main class="pprf-app__main">
        <router-view name="sidebar"></router-view>
        <router-view name="map"></router-view>
    </main>

  </div>

</template>

<script>
import pprfHeaderContainer from '@/containers/pprf-header-container'
/**
 * MAIN APPLICATION COMPONENT.
 *
 * This is the base component that lives at the top of
 * the component tree
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Finder',
  components: {pprfHeaderContainer}
}
</script>


<style lang="scss" >
  @import "~leaflet/dist/leaflet.css";

    #pprf-app-container {
      width: 100%;
      max-width: $max-app-width;
      height: 1024px;

      display:block;
      position:relative;

      margin: 0 auto;
      padding:0;
      box-sizing: border-box;
    }


    .pprf-app__main {
        display:flex;
        flex-direction: row;
        border: 1px solid color(black);
    }

</style>
