<template>
    <aside class="pprf-sidebar">
        <div class="pprf-sidebar-inner">

            <header class="pprf-sidebar-header">
              <h2 class="pprf-sidebar-header__title text-nopad">Things to do</h2>
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
                    <h4>programs content</h4>
                  </pprf-tab>

                  <pprf-tab
                    name="Locations"
                  >
                    <h4>locations content</h4>
                  </pprf-tab>

              </pprf-tabs>
            </main>

        </div>
    </aside>
</template>

<script>
import pprfTabs from '@/components/pprf-tabs/pprf-tabs'
import pprfTab from '@/components/pprf-tabs/pprf-tab'
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
      height: 100vh;
      max-width: 451px;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
  }
    .pprf-sidebar-inner{
        width: 100%;
        height: 100%;
        background: color(ghost-gray);
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
        height: 100%;
        overflow:hidden;
      }


</style>
