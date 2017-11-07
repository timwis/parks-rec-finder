<template>
    <aside class="pprf-sidebar">
        <div class="pprf-sidebar-inner">

            <header class="pprf-sidebar-header">
              <h2 class="pprf-sidebar-header__title text-nopad">
                <slot name="heading"></slot>
              </h2>
              <div class="pprf-sidebar-header__desc">
                <slot name="description"></slot>
              </div>
            </header>

            <main class="pprf-sidebar-main">

              <pprf-tabs>

                  <pprf-tab
                    name="Programs"
                    :count="programsCount"
                    :selected="true"
                   >
                    <slot name="programs-tab-content"></slot>

                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                    :count="locationsCount"
                  >
                    <slot name="locations-tab-content"></slot>
                  </pprf-tab>


              </pprf-tabs>
            </main>

        </div>
    </aside>
</template>

<script>
import {pprfTabs, pprfTab} from '@/components/pprf-tabs/'

/**
 * APPLICATION SIDEBAR
 *
 * Contains Search Results Lists and Detail Items
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Sidebar',

  components: {
    pprfTabs,
    pprfTab
  },

  props: {
    programsCount: {
      type: Number
    },
    locationsCount: {
      type: Number
    }
  }
}
</script>

<style lang="scss" scoped>

  .pprf-sidebar{
      flex: 1;
      height: 100%;
      max-width: 451px;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
  }
    .pprf-sidebar-inner{
        width: 100%;
    }
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
        height: 800px;
        overflow:hidden;
        background: color(ghost-gray);
      }


</style>
