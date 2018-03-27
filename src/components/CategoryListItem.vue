<template>
  <li>
    <router-link :to="url">
      {{ name }} ({{ count }})
      <img :src="photo">
    </router-link>
  </li>
</template>

<script>
import { slugify } from '~/util'

export default {
  props: {
    name: String,
    count: Number,
    photo: String,
    urlPrefix: String, // locations or activities
    slug: String
  },
  computed: {
    url () {
      return `/${this.urlPrefix}/${this.slug}`
    }
  }
}
</script>
