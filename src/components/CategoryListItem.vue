<template>
  <li class="category">
    <router-link
      :to="url"
      class="link">
      <h3 class="name">{{ name }}</h3>
      <ItemCount :count="count"/>
      <div
        class="description">
        {{ description }}
      </div>
      <img
        :src="photo"
        class="photo">
    </router-link>
  </li>
</template>

<script>
import ItemCount from '~/components/ItemCount'

export default {
  components: {
    ItemCount
  },
  props: {
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      default: ''
    },
    urlPrefix: {
      type: String, // locations or activities
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  },
  computed: {
    url () {
      return `/${this.urlPrefix}/${this.slug}`
    }
  }
}
</script>
<style lang="sass">
.category
  position: relative
  margin-bottom: 1rem
  background: black
  height: 280px
  @media screen and (max-width: 39.9375em)
    height: 200px

  img
    width: 100%
    height: 100%
    @media screen and (max-width: 39.9375em)
      height: 200px

  .name
    position: absolute
    top: 1rem
    left: 1rem
    z-index: 9
    color: white
    font-weight: bold
    width: 16rem

  .photo
    display: block
    opacity: .5
    object-fit: cover

  .description
    display: none
</style>
