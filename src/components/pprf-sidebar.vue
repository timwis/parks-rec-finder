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

            </main>

        </div>
    </aside>
</template>

<script>
/**
 * APPLICATION SIDEBAR
 *
 * Contains Search Results Lists and Detail Items
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
      height: 100vh;
      max-width: 451px;
      padding: 15px 20px 0 20px;
      color: color(dark-ben-franklin);
  }
    .pprf-sidebar-inner{
        width: 100%;
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
        height: 891px;
        overflow:hidden;
      }


</style>
