<template>
    <aside class="pprf-sidebar">
      <div class="pprf-sidebar__inner">

        <header class="pprf-sidebar__header">
          <pprf-back-btn />
          <slot name="sidebar-header" />
        </header>

        <main class="pprf-sidebar__main">
          <slot name="sidebar-main" />
        </main>

        <footer class="pprf-sidebar__footer">
          <slot name="sidebar-footer" />
        </footer>

      </div>

    </aside>
</template>

<script>
import pprfBackBtn from '@/components/pprf-back-btn'
/**
 * APPLICATION SIDEBAR
 *
 * Layout wrapper component
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Sidebar',
  components: {pprfBackBtn},
  props: {
    modifierClass: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>

  .pprf-sidebar{
      flex: 1;
      height:calc(#{$max-app-height} - #{$header-height});
      max-width: 451px;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
      border-right: 1px solid color(ghost-gray);
      overflow: hidden;
  }
  .pprf-sidebar--nopad {
    padding:0;
    .pprf-back-btn{margin-left: 15px;}
    .pprf-sidebar__main{
      padding: 0 15px;
    }
  }
    .pprf-sidebar__inner{
        width: 100%;
        height:100%;
        display:flex;
        flex-flow:column;
        //overflow: auto;

    }
        .pprf-sidebar__header{}
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
        overflow: auto;
      }

/* =======================================================================
Category Sidebar
========================================================================== */

.pprf-sidebar--category{

}
.pprf-sidebar__header--category{
    padding-top: 20px;
    background: lighten(color(light-ben-franklin), 10%);
    border-bottom: 1px solid $white;
  }
  .pprf-sidebar__title--category {
    padding: 0px 0px 20px 20px;
    color: $black;
    display:inline-block;
  }
  .category-results-badge {
    float: right;
    margin-right: 20px;
  }


</style>
