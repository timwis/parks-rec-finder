<template>
  <router-link
    :to="slugifyURL(name)"
    class="pprf-category-card">
      <h4 class="pprf-category-card__name text-nopad">{{name}}</h4>
      <pprf-results-count-badge
        type="program"
        :count="count"
        icon="map-marker-alt"
      />
      <p v-if="description" class="pprf-category-card__desc">
        {{description}}
      </p>
      <div class="pprf-category-card__image"
      :style="'background-image: url('+photoURL+')'"></div>
      <div class="pprf-category-card__shade"></div>
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
  position: relative;
  display: block;
  &:hover{
    cursor: pointer;

    &:after{
      transform: translateY(0%);
      opacity: .7;
    }
    .pprf-category-card__desc{
      bottom:0;
      opacity:1;
      transform: translateY(0%);
    }
  }

}
.pprf-category-card__image{
  display: block;

  width: 100%;
  height:200px;
  position: relative;

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

    left:0;
    opacity: .5;
    transition: bottom 0.5s ease, opacity 0.75s ease;

    box-shadow: $box-shadow;
    .pprf-category-card__name{
      text-shadow: $box-shadow;
    }

    pointer-events: none;
    background: $black;
  }

  &:hover{
    cursor: pointer;

    &:after{
      transform: translateY(0%);
      opacity: .7;
    }
  }
}

  .pprf-category-card__name {
    position: absolute;
    z-index: 2;
    display: inline-block;
    width:75%;
    top: 7%;
    left: 3%;
    font-family: $font-montserrat;
    font-weight: 700;
    color: $white;
    @include rem(font-size, 2.0);
    @include rem(line-height, 2.85);
    pointer-events: none;
  }

  .pprf-category-card__desc{
    position: absolute;
    bottom:0;
    z-index: 4;
    padding: 1rem;
    color:$white;
    @include rem(line-height, 1.75);
    opacity: 0;
    transform: translateY(50%);
    transition: transform 0.75s ease, opacity 0.75s ease;
    pointer-events: none;

  }

  .pprf-category-card .pprf-results-badge{
    position: absolute;
    z-index: 2;
    right:3%;
    top:8%;
    pointer-events: none;

  }





  @include breakpoint (medium down) {
    .pprf-category-card{
      margin-bottom: 0;
      border-radius: 0px;
    }

  }
</style>
