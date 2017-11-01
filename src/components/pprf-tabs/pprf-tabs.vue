<template>
    <div class="pprf-tabs">

        <ul class="pprf-tabs__nav">
            <li v-for="tab in tabs"
                :class="['pprf-tabs__nav-item',{'active': tab.isActive}]"
              >
                <button
                    class="button pprf-tabs__nav-item-btn text-caps"
                    @click="selectTab(tab)"
                >
                    {{tab.name}}
                </button>
            </li>
        </ul>

        <div class="pprf-tabs-content scrollable">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import PhilaButton from '@/components/phila/phila-button'
/**
 * Tabular user interface
 *
 * @since 0.0.0
 */
export default {
  name: 'PPRF-Tabs',

  components: {
    PhilaButton
  },

  data () {
    return {
      tabs: []
    }
  },

  created () {
    this.tabs = this.$children
  },

  methods: {
    selectTab (selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
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


    .pprf-tabs-content{
        width:100%;
        display:block;
        margin-top:20px;
        border: 1px solid $black;
    }
</style>
