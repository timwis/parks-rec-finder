<template>

  <div id="pprf-app__container" >

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


<style lang="scss" scoped>
  @import "~leaflet/dist/leaflet.css";

    #pprf-app__container {
      width: 100%;
      max-width: $max-app-width;
      height: $max-app-height;
      display:block;
      position:relative;

      margin: 0 auto;
      padding:0;
      box-sizing: border-box;
      overflow: hidden;
      //border: 3px solid red;
    }


    .pprf-app__main {
        display:flex;
        height: 91.5vh;
        //border: 3px solid green;
        flex-direction: row;
    }

</style>
