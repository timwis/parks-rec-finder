<template>
    <aside class="pprf-sidebar">
        <div class="pprf-sidebar-inner">

            <header class="pprf-sidebar-header">
              <h2 class="pprf-sidebar-header__title text-nopad">Things to go</h2>
              <p class="pprf-sidebar-header__desc">
                Choose a category from the list below to find a program for you.
              </p>
            </header>

            <main class="pprf-sidebar-main">

              <pprf-tabs>

                  <pprf-tab
                    name="Programs"
                    :selected="true"
                   >
                    <div class="card card--program">
                        <h3 id="test">test</h3>
                    </div>
                    <div class="card card--program"></div>
                    <div class="card card--program"></div>
                    <div class="card card--program"></div>
                    <div class="card card--program"></div>
                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                  >
                    <h3>locations content</h3>
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
      h3:focus{
        background: $black;
        color:color(flyers-orange);
      }


</style>
