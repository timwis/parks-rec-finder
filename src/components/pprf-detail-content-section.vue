<template>
  <div class="pprf-detail-section">
    <h4 class="pprf-detail-section__heading text-nopad">
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
        class="pprf-detail-section__heading-icon"
      />
      <span>{{heading}}</span>
    </h4>
    <slot></slot>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
/**
 * ENTITY DETAIL CONTENT SECTION
 *
 * used to show conent with a heading and heading icon
 *
 * @since 0.1.0
 */
export default {

  name: 'PPRF-Detail-Content-Section',
  components: {FontAwesomeIcon},
  props: {
    heading: {
      type: String
    },
    icon: {
      type: String
    }
  }

}
</script>

<style lang="scss" scoped>
  .pprf-detail-section{

    margin-bottom: 30px;
    address{
      font-style: normal;
    }
    a{
      font-family: $font-montserrat;
      font-weight: 700;
      @include rem(font-size, 1.2);
    }
    p{
      color: $black;
    }
  }

  .pprf-detail-section__heading{
    display: flex;
    align-items: center;
    color: color(dark-gray);
    @include rem(font-size, 1.5);
    @include rem(line-height, 1.25);
    padding-bottom:5px;
  }
  .pprf-detail-section__heading-icon{
    color: $black;
    margin: 0px 10px 0 0;
    @include rem(font-size, 1.25);
  }
</style>
