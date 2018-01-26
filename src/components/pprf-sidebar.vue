<template>
    <aside class="pprf-sidebar">
      <div class="pprf-sidebar__inner">

        <header class="pprf-sidebar__header">
          <pprf-back-btn />
          <slot name="sidebar-header" />
        </header>

        <main class="pprf-sidebar__main" >
          <slot name="sidebar-main" />
        </main>

        <pprf-leaflet-map-container :class="['pprf-map__container--mobile', {'pprf-map__container--open-mobile': mobileMapOpen}]" />

        <footer class="pprf-sidebar__footer">
          <slot name="sidebar-footer" />
        </footer>

      </div>

    </aside>
</template>

<script>
import pprfBackBtn from '@/components/buttons/pprf-back-btn'
import pprfLeafletMapContainer from '@/containers/main/map/pprf-leaflet-map-container'

/**
 * APPLICATION SIDEBAR
 *
 * simple layout wrapper, also contains the mobile leaflet map
 *
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Sidebar',
  components: {pprfBackBtn, pprfLeafletMapContainer},
  props: {
    modifierClass: {
      type: String,
      default: null
    }
  },
  computed: {
    mobileMapOpen () {
      return !this.$store.state.mobile.listView
    }
  }
}
</script>

<style lang="scss">

  .pprf-sidebar{
      flex: 1;
      height:calc(#{$max-app-height} - #{$header-height} - #{$footer-height} + 20px);
      max-width: $sidebar-width;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
      border-right: 1px solid color(ghost-gray);
      overflow: hidden;

      .pprf-map__container{
        display: none;
      }
  }

  .pprf-sidebar--nopad {
    padding:0;
    .pprf-back-btn{margin-left: 15px;}
    .pprf-sidebar__main{
      padding: 0 2rem 2rem 3rem;
    }
  }
    .pprf-sidebar__inner{
        width: 100%;
        height:100%;
        display:flex;
        flex-flow:column;
        //overflow: auto;
    }
        .pprf-sidebar__header{
          background: $white;
        }
        .pprf-sidebar__title{

            font: {
                family: $font-montserrat;
                weight: 700;
            }
        }

        .pprf-sidebar__desc{
          width: 90%;
          min-height: 50px;
        }

      .pprf-sidebar__main{
        flex:1;
        display: flex;
        flex-direction: column;
        overflow: auto;
      }

.pprf-sidebar--mobile-view-btn{
  display: none;
}

/* =======================================================================
Single Category Sidebar
========================================================================== */

.pprf-sidebar.pprf-sidebar--category{
  .pprf-filter-bar-form__open{
    .scrollable{
      height: calc(100vh - 220px);
    }
  }

}
.pprf-sidebar__header--category{
    padding-top: 20px;
    background: lighten(color(light-ben-franklin), 10%);
    border-bottom: 1px solid $white;
  }
  .pprf-sidebar__title--category {
    max-width: 75%;
    padding: 0px 0px 20px 20px;
    margin:0;
    color: $black;
    display:inline-block;
  }
  .category-results-badge {
    float: right;
    margin-right: 20px;
  }

/* =======================================================================
Entity Detail
========================================================================== */
.pprf-sidebar--entity-detail{
  color: $black;
}



@include breakpoint (medium down) {
  .pprf-sidebar {
    width: 100%;
    max-width: 100%;
    padding: 0;
    flex: auto;
    height:calc(#{$max-app-height} - #{$header-height-mobile});
    //position: absolute;
    //top:$header-height-mobile;
    //left: 0;
    z-index: 1000;
  }
  .pprf-sidebar__main {
    background: $white;
  }
  .pprf-sidebar__main--hidden{
    display: none;
  }

  .pprf-sidebar.pprf-sidebar--nopad{
    .pprf-sidebar__header{ padding: 0;}
  }
  .pprf-sidebar__header{
    padding: 15px;
  }



}

</style>
