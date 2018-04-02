<template>
  <LPopup>
    <h3>{{ name }}</h3>
    <div v-if="phone">
      <i class="fa fa-phone"></i>
      {{ phone | formatPhone }}
    </div>
    <router-link :to="`/location/${this.id}`">
      View details
    </router-link>
  </LPopup>
</template>

<script>
import { LPopup } from 'vue2-leaflet'
import { formatPhone } from '~/util'

export default {
  props: {
    id: String,
    name: String,
    phone: String
  },
  components: {
    LPopup
  },
  filters: {
    formatPhone
  }
}
</script>
