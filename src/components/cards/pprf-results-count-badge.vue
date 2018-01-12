<template>
    <div :class="['pprf-results-badge', {'pprf-results-badge--w-icon': icon, ['pprf-results-badge--'+type]: type}]">
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      size="xs"
      />
      <span class="pprf-results-badge__count">{{count}}</span>
    </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
/**
 * Display the result count with an optional icon
 *
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Results-Count-Badge',

  props: {
    count: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },

  components: {FontAwesomeIcon},

  mounted () {
    // @TODO: make this properly mutate the local state
    // this._max = this.count
    // let i = 0
    // let interval = setInterval(() => {
    //   if (i === this._max) {
    //     clearInterval(interval)
    //   }
    //   this.count = i
    //   i++
    // }, 0)
  }
}
</script>

<style lang="scss" scoped>
    .pprf-results-badge{
        width:70px;
        display: flex;
        align-items: center;
        @include rem(font-size, 1.4);
        justify-content: space-around;
        background: color(ghost-gray);
        border-bottom: 2px solid color(flyers-orange);
        color: $black;
        border-radius: $border-radius;
        padding: 0 10px ;
    }
    .pprf-results-badge--w-icon{
        .pprf-results-badge__count{
            padding: 0 0 0 10px;
        }
    }

    .pprf-results-badge__count{
        font-family: $font-montserrat;
        line-height:2;
        font-wieght: 100;
        padding: 0 5px;
    }
</style>
