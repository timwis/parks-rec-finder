<template>
    <aside class="pprf-sidebar">
      <slot />
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
  name: 'PPRF-Sidebar'
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
    .pprf-sidebar-inner{
        width: 100%;
        height:100%;
        display:flex;
        flex-flow:column;
        overflow: auto;

    }
        .pprf-sidebar-header{}
        .pprf-sidebar-header__title{
            font: {
                family: $font-montserrat;
                weight: 700;
            }
        }
        .pprf-sidebar-header__desc{
          width: 90%;
        }

      .pprf-sidebar-main{
        flex:1;
      }




</style>
