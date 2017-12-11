<template>
  <div class="pprf-detail-section">
    <h4 class="pprf-detail-section__heading text-nopad">
      <font-awesome-icon
        v-if="icon"
        size="s"
        :icon="icon"
        class="pprf-detail-section__heading-icon"
      />
      {{heading}}
    </h4>
    <slot></slot>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
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
    margin-bottom: 50px;
  }

  .pprf-detail-section__heading{
    color: color(medium-gray);

  }
  .pprf-detail-section__heading-icon{
    color: $black;
    margin: -2px 5px 0 0;
  }
</style>
