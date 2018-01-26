<template>
  <router-link
    :to="slugifyURL(name)"
    class="pprf-category-card"
    :style="'background-image: url('+photoURL+')'"
  >
      <h4 class="pprf-category-card__name text-nopad">{{name}}</h4>
      <pprf-results-count-badge
        type="program"
        :count="count"
        icon="map-marker-alt"
      />
      <p v-if="description" class="pprf-category-card__desc">
        {{description}}
      </p>
  </router-link>
</template>

<script>
import pprfResultsCountBadge from '@/components/cards/pprf-results-count-badge'

/**
 * ENTITY CATEGORY CARD
 *
 * Simple functional component to display a category card with image, desc, count, and title
 *
 * @since 0.1.0
 */
export default {

  name: 'PPRF-Category-Card',
  components: {pprfResultsCountBadge},
  props: {
    name: {
      type: String
    },
    /**
     * number of entities (progams or locations) in category
     * @type {Object}
     */
    count: {
      type: Number
    },
    description: {
      type: String,
      default: null
    },
    photoURL: {
      type: String,
      default: null
    }
  },
  methods: {
    /**
     * slugify the category name from the name prop
     * @param  {string} taxonomyTerm
     * @return {string}              FORMAT: /entity-type/taxonomy-term-slug
     *
     * @public
     * @since 0.1.0
     */
    slugifyURL (taxonomyTerm) {
      let termSlug = taxonomyTerm.split(' ').map(termPart => termPart.charAt(0).toLowerCase() + termPart.slice(1)).join('-')
      return `/${this.$store.state.route.params.entityType}/${termSlug}`
    }
  }

}
</script>

<style lang="scss" scoped>
.pprf-category-card{
  display: block;

  width: 100%;
  height:200px;
  position: relative;

  padding: 13px 10px;
  margin-bottom: 20px;

  background: color(sidewalk);
  background-size: 100%;

  border-radius: $border-radius;
  overflow: hidden;


  //bg shadow
  &:after{
    content: '';
    display: block;
    width: 100%;
    height: 100%;

    position: absolute;
    z-index: 1;

    bottom: -10%;
    left:0;
    opacity: 0;
    transition: bottom 0.5s ease, opacity 0.75s ease;
    pointer-events: none;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.65+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=0 ); /* IE6-9 */
  }

  &:hover{
    cursor: pointer;
    cursor: hand;
    box-shadow: $box-shadow;
    .pprf-category-card__name{
      text-shadow: $box-shadow;
    }
    &:after,
    .pprf-category-card__desc{
      bottom:0;
      opacity:1;
      transform: translateY(0%);
    }
  }
}

  .pprf-category-card__name {
    position: relative;
    z-index: 2;
    display: inline-block;
    width:75%;
    padding:5px 0 0 5px;

    font-family: $font-montserrat;
    font-weight: 700;
    color: $white;
    @include rem(font-size, 2.0);
    @include rem(line-height, 2.85);
  }

  .pprf-category-card__desc{
    position: absolute;
    bottom:0;
    z-index: 3;
    padding-right: 10px;
    color:$white;
    @include rem(line-height, 1.75);
    opacity: 0;
    transform: translateY(50%);
    transition: transform 0.75s ease, opacity 0.75s ease;
  }

  .pprf-category-card .pprf-results-badge{
    position: relative;
    z-index: 2;

    float:right;
  }





  @include breakpoint (medium down) {
    .pprf-category-card{
      margin-bottom: 0;
      border-radius: 0px;
    }

  }
</style>
