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

        <slot name="beforePanes"/>

        <div class="pprf-tabs-panels scrollable">
          <slot></slot>
        </div>

        <slot name="afterPanes"/>
    </div>
</template>

<script>
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

  mounted () {
    // only add tabs that are tab panel components
    this.tabs = this.$children.filter(child => { return child._vnode.data.staticClass === 'pprf-tab-panel' })
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
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
      /**
       * @event tabSelected
       * @type {object}
       */
      this.$emit('tabSelected', selectedTab)
      this.$store.dispatch('setActiveTab', selectedTab.name)
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
        position:relative;
        padding: 5px 10px 0 5px;
        font-family: $font-montserrat;
        @innclude rem(font-size, 14);

        &:first-child{
          padding-left:0px;
          .pprf-tabs__nav-item-btn{padding-left:0px;}

          &:after{
            content:'';
            position: absolute;
            display:block;
            top:45%;
            right:0;
            width:1px;
            height:25%;
            background: color(dark-ben-franklin);
          }

        }


        &.active{
            .pprf-tabs__nav-item-btn{
              font-weight: 700;

              &:before{
                content:'';
                display:block;
                width: 80%;
                height: 2px;
                position:absolute;
                left:0%;
                bottom:0;
                background: color(dark-ben-franklin);
              }

            }
        }
    }
        .pprf-tabs__nav-item-btn{
            background:none;
            padding:5px 10px;
            color: color(dark-ben-franklin);
        }


    .pprf-tabs-panels{
        width:100%;
        height: 737px;
        display:block;
        margin-top:20px;
        padding-right: 10px;
    }
</style>
