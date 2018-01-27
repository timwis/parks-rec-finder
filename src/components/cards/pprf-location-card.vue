<template>
  <div
   :class="['card', 'card--location', {'card--nested': nested, 'card--selected': selected}]"
   :id="'facility--'+facilityID"
  >
      <font-awesome-icon
        v-if="!nested"
        icon="map-marker-alt"
        size="3x"
        class="card__icon card--location__icon"
      />

    <div class="card__info">
      <div class="card__info-name">
        <h3 class="text-nopad">
          <router-link
            v-if="name"
            :to="'/location/'+facilityID"
            class="text-nopad"
          >
          {{name}}
          </router-link>
        </h3>
      </div>



        <address v-if="address" class="card__info-meta">
          <p>{{address.street}}&nbsp;{{address.city}}, {{address.zip}}</p>
       </address>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {

  name: 'PPRF-Location-Card',
  components: {
    FontAwesomeIcon
  },
  props: {
    name: {
      type: String
    },
    address: {
      type: Object,
      default: null
    },
    facilityID: {
      type: String
    },
    distance: {
      type: Number
    },
    nested: {
      type: Boolean
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

  .card.card--location{
    display: flex;
    padding: 10px;
    border-bottom: 1px solid color(dark-gray);
    position: relative;
    padding-bottom: 0;

    .card__info{
      height: 80px;
      display:flex;
      flex-direction:column;
    }

    .card__info-name{
      flex-grow: 1;
    }
    .card__info-meta{
      display: flex;
      margin-bottom: 10px;
      small {margin-right: 5%;}
    }

  }

  .card--location__icon{
    margin: 0px 5% 0 5%;
    color: #A5097E;
  }

</style>
