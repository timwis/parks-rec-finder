<template>

  <div id="pprf-app-container" class="foobar">

    <pprf-header></pprf-header>

    <main class="pprf-app__main">
        <router-view name="PprfSidebar"></router-view>
        <router-view name="PprfMap"></router-view>
    </main>

  </div>

</template>

<script>
import PprfHeader from '@/components/pprf-header'
/**
 * MAIN APPLICATION COMPONENT.
 *
 * This is the base component that lives at the top of
 * the component tree
 */
export default {
  name: 'PprFinder',
  components: {
    PprfHeader
  }
}
</script>

<style src="./style/main.scss" lang="scss"></style>
<style lang="scss" >
    #pprf-app-container {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding:0;
    }


    .pprf-app__main {
        display:flex;
        flex-direction: row;
        border: 1px solid color(black);
    }

</style>
