<template>
  <li class="category mam">
    <router-link
      :to="url"
      class="category--link">
      <h3
        class="category--name">{{ name }}</h3>
      <ItemCount
        :count="count" />
      <div
        class="category--description">
        {{ description }}
      </div>
      <img
        :src="photo"
        class="category--photo">
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
  max-height: 275px
  .category--name
    position: absolute
    top: 1rem
    left: 1rem
    z-index: 9
    color: white
    font-weight: bold

  .category--photo
    display: block
    opacity: .5
    object-fit: cover

  .category--description
    display: none

</style>
