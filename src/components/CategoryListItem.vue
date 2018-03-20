<template>
  <li>
    <router-link :to="url">
      {{ name }} ({{ count }})
    </router-link>
  </li>
</template>

<script>
import { slugify } from '~/util'

export default {
  props: {
    urlPrefix: String, // locations or activities
    name: String,
    count: Number,
    photo: String
  },
  computed: {
    slug () {
      return slugify(this.name)
    },
    url () {
      return `/${this.urlPrefix}/${this.slug}`
    }
  }
}
</script>
