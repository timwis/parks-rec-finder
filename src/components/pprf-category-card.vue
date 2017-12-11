<template>
  <router-link
    :to="slugifyURL(name)"
    class="pprf-category-card">
      <h4 class="pprf-category-card__name text-nopad">{{name}}</h4>
      <pprf-results-count-badge
        type="prgoram"
        :count="count"
        icon="map-marker-alt"
      />
      <p v-if="description" class="pprf-category-card__desc">
        {{description}}
      </p>
  </router-link>
</template>

<script>
import pprfResultsCountBadge from '@/components/pprf-results-count-badge'
import slugify from 'slugify'

export default {

  name: 'PPRF-Category-Card',
  components: {pprfResultsCountBadge},
  props: {
    name: {
      type: String
    },
    count: {
      type: Number
    },
    description: {
      type: String,
      default: null
    }
  },
  methods: {
    slugifyURL (taxonomyTerm) {
      // let termSlug = entityTerm.split(' ').map(termPart => termPart.charAt(0).toLowerCase() + termPart.slice(1)).join('-')
      return `/${this.$store.state.route.params.entityType}/${slugify(taxonomyTerm, {lower: true})}`
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
</style>
