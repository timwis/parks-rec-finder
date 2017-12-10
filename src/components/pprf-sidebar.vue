<template>
    <aside :class="{['pprf-sidebar--'+modifierClass]: modifierClass}" class="pprf-sidebar">
      <div class="pprf-sidebar__inner">

        <header class="pprf-sidebar__header">
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
/**
 * APPLICATION SIDEBAR
 *
 * Layout wrapper component
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Sidebar',
  props: {
    modifierClass: {
      type: String,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

  .pprf-sidebar{
      flex: 1;
      //height: calc(1024px - 65px);
      max-width: 451px;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
      border-right: 1px solid color(ghost-gray);
  }
  .pprf-sidebar--nopad {
    padding:0;
  }
    .pprf-sidebar__inner{
        width: 100%;
        height:100%;
        display:flex;
        flex-flow:column;
        overflow: auto;

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

      .pprf-sidebar-main{
        flex:1;
      }




</style>
