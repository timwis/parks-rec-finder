<template>
  <LPopup>
    <h3>{{ name }}</h3>
    <div v-if="phone">
      <i class="fa fa-phone"/>
      {{ phone | formatPhone }}
    </div>
    <router-link :to="`/location/${id}`">
      View details
    </router-link>
  </LPopup>
</template>

<script>
import { LPopup } from 'vue2-leaflet'
import { formatPhone } from '~/util'

export default {
  components: {
    LPopup
  },
  filters: {
    formatPhone
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  }
}
</script>
