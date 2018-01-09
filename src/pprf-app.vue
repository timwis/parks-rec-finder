<template>
    <div id="pprf-app__container"
         :class="[bodyClass, {'pprf-app--mobile-search-open': mobile.searchOpen, 'pprf-app--mobile-map-view': !mobile.listView, 'pprf-app--mobile-filters-open': mobile.filtersOpen}]"
    >

      <pprf-header-container></pprf-header-container>

      <main class="pprf-app__main" >
          <router-view name="sidebar"></router-view>
          <router-view name="map"></router-view>
      </main>

      <footer class="pprf-footer">
        <a class="text-upper" href="http://beta.phila.gov">City of Philadelphia</a> |
        <a class="text-upper" href="">How to use</a> |
        <a class="text-upper" href="">Feedback</a>
        <small id="versionNumber" class="text-nopad">v{{version}}</small>
      </footer>
    </div>
</template>

<script>
import pprfHeaderContainer from '@/containers/pprf-header-container'
import { mapState } from 'vuex'
import {version} from '../package.json'
import {EventBus} from '@/event-bus'
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
  data () {
    return {
      version,
      mobileListView: true
    }
  },
  mounted () {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
    EventBus.$on('mobileView:toggle', () => {
      this.mobileListView = !this.mobileListView
    })
  },
  computed: {
    ...mapState({
      mobile: state => state.mobile,
      bodyClass: state => state.route.meta.bodyClass
    })
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


<style lang="scss">
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
      //overflow: hidden;
      //border: 3px solid red;
    }


    .pprf-app__main {
        display:flex;
        //height: 91.5vh;
        //border: 3px solid green;
        flex-direction: row;
    }


  .pprf-footer{
    width: 100%;
    height: $footer-height;
    display:inline-block;
    text-align: center;
    position: fixed;
    bottom: 0;
    left:0;
    z-index: 1000;
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
    .pprf-app__main {
      flex-direction: column;
    }

    // search open
    .pprf-app--mobile-search-open{
       .pprf-header { height: 120px; }
       .pprf-sidebar { height: calc(100vh - 120px); }
    }

    // search and map open
    .pprf-app--mobile-search-open.pprf-app--mobile-map-view{
      .pprf-map__container{
        top: 272px;
        height:calc(#{$max-app-height} - #{$header-height-mobile} - 148px - 102px);
      }
    }

    // map open
    .pprf-app--mobile-map-view{
      .pprf-map__container{
        z-index: 1000;
        top:212px;
        height:calc(#{$max-app-height} - #{$header-height-mobile} - 148px - 40px);
      }
      .pprf-sidebar__main {
        display: none;
      }
    }

    // map and filters open
    .pprf-app--mobile-map-view.pprf-app--mobile-filters-open{
      .pprf-map__container{
        z-index: 100;
      }
    }


    //.view--taxonomy-list.pprf-app--mobile-map-view{
    //  .pprf-map__container{
    //    display: none;
    //  }
    //  .pprf-sidebar__main {
    //    display: block;
    //  }
    //}



    .pprf-footer{
      display: none;
    }

  }
</style>
