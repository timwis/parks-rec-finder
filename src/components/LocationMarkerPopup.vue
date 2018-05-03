<template>
  <LPopup>
    <h3>{{ name }}</h3>
    <div v-if="phone">
      <font-awesome-icon
        icon="phone"/>
      {{ phone | formatPhone }}
    </div>
    <router-link
      :to="`/location/${slug}/${id}`"
      data-testid="popupLink">
      View details
    </router-link>
  </LPopup>
</template>

<script>
import { LPopup } from 'vue2-leaflet'
import { formatPhone } from '~/util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  components: {
    LPopup,
    FontAwesomeIcon
  },
  filters: {
    formatPhone
  },
  props: {
    id: {
      type: String,
      required: true
    },
    slug: {
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
