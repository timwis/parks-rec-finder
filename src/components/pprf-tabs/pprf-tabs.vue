<template>
    <div class="pprf-tabs">

        <ul
          class="pprf-tabs__nav"
        >
            <li
                v-for="tab in tabs"
                :class="['pprf-tabs__nav-item',{'active': tab.isActive}]"
                :aria-selected="[tab.isActive ? true : false]"
                role="presentation"
              >
                <button
                    class="button pprf-tabs__nav-item-btn text-caps"
                    @click="selectTab(tab)"
                >
                    {{tab.name}}
                    <span v-show="tab.count"><small>({{tab.count}})</small></span>
                </button>
            </li>

        </ul>

        <div class="pprf-tabs-panels scrollable">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import router from '@/router'
/**
 * Tabular user interface
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Tabs',

  data () {
    return {
      tabs: []
    }
  },

  created () {
    this.tabs = this.$children
  },

  methods: {
    /**
     * Sets the "selected" prop of a tab
     * @param  {object} selectedTab Vue instanace
     * @return {void}
     * @public
     * @since 0.0.0
     */
    selectTab (selectedTab) {
      let routeNames = router.options.routes.map(routeObj => routeObj.name)
      if (routeNames.includes(selectedTab.name)) {
        router.push({name: selectedTab.name})
      }
      /**
       * @event tabSelected
       * @type {object}
       */
      this.$emit('tabSelected', selectedTab)
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-tabs{
    width: 100%;
}
    .pprf-tabs__nav{
        width:100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: baseline;
        margin:0;
        padding:0;

        list-style:none;
    }
    .pprf-tabs__nav-item{
        padding: 5px 10px 0 5px;
        &:first-child{padding-left:0px;}
        &.active{
            border-bottom: 2px solid color(ben-franklin-blue);
        }
    }
        .pprf-tabs__nav-item-btn{
            background:none;
        }


    .pprf-tabs-panels{
        width:100%;
        height: 737px;
        display:block;
        margin-top:20px;
        padding-right: 10px;
    }
</style>
