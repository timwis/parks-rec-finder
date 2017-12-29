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
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Finder',
  components: {pprfHeaderContainer},
  mounted () {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
  },
  created () {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }

      //  start the progress bar
      this.$Progress.start()

      //  continue to next page
      next()
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish()
    })
  }
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
