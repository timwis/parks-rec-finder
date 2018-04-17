<template>
  <li>
    <router-link :to="url">
      {{ name }} ({{ count }})
      {{ description }}
      <img :src="photo">
    </router-link>
  </li>
</template>

<script>
export default {
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
