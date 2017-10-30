<template>

  <div id="pprf-app-container" >

    <pprf-header></pprf-header>

    <main class="pprf-app__main">
        <router-view name="map"></router-view>
        <router-view name="sidebar"></router-view>
    </main>

  </div>

</template>

<script>
import pprfHeader from '@/components/pprf-header'
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
  components: {
    pprfHeader
  }
}
</script>

<style src="./style/main.scss" lang="scss"></style>
<style lang="scss" >
    #pprf-app-container {
      width: 100%;
      max-width: 1440px;

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
