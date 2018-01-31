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
                    :class="['pprf-btn', 'pprf-tabs__nav-item-btn', 'text-caps', {'pprf-tabs__nav-item-btn--w-count': tab.count}]"
                    @click="selectTab(tab)"
                >
                    {{tab.name}}
                    <span v-show="tab.count"><small>({{tab.count}})</small></span>
                </button>
            </li>

        </ul>

        <slot name="beforePanes"/>

        <div class="pprf-tabs__panels scrollable">
          <slot></slot>
        </div>

        <slot name="afterPanes"/>
    </div>
</template>

<script>
/**
 * Tabular user interface
 *
 * @since 0.1.0
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
     * @since 0.1.0
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

<style lang="scss" >
.pprf-tabs{
  width: 100%;
  height: 100%;
  position: relative;
  //display: flex;
  //flex-flow: column;
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
        @include rem(font-size, 1.4);

        &:first-child{
          padding-left:0px;
          .pprf-tabs__nav-item-btn{
            padding-left:0px;
            &:before{width: 81%; left:0; transform: none;}
          }

          &:after{
            content:'';
            position: absolute;
            display:block;
            top:45%;
            right:0;
            width:2px;
            height:25%;
            background: color(dark-ben-franklin);
          }
        }


        &.active{
            .pprf-tabs__nav-item-btn{
              font-weight: 700;

              &:before{
                width: 75%;
                height: 2px;
              }
            }
            .pprf-tabs__nav-item-btn--w-count::before{
                width: 80%;
            }

        }
    }
        .pprf-tabs__nav-item-btn{
            background:none;
            padding:5px 10px;
            color: color(dark-ben-franklin);

            &:active,
            &:focus{
              border: none;
              outline: none;
            }

            &:before{
              content:'';
              display:block;
              width: 0%;
              height: 0px;
              position:absolute;
              left:50%;
              transform: translateX(-50%);
              bottom:0;
              background: color(dark-ben-franklin);
              transition: all .25s cubic-bezier(1.0, 0.5, 0.8, 1.0);
            }

        }



    .pprf-tabs__panels{
      width:100%;
      height: calc(100% - 80px);
      max-height: 100%;
      position: absolute;
      z-index:1;
      top:80px;
      flex:1;
    }



@include breakpoint (medium down) {
  .pprf-tabs__nav{
    padding: 0 15px;
    justify-content:space-around;
  }

  .pprf-tabs__nav-item{
    width: 100%;
    text-align: center;
  }

}

</style>
