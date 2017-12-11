<template>
  <div class="card card--location">
    <div class="card__info">
      <font-awesome-icon icon="map-marker" size="xl" />
      <h3 v-if="name" class="card__info-name text-nopad">
        <router-link :to="'/location/'+facilityID">{{name}}</router-link>
      </h3>

        <address class="card__info-meta">
          <p>{{address.street}}&nbsp;&nbsp;{{address.city}}, {{address.zip}}</p>
       </address>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {

  name: 'PPRF-Location-Card',
  components: {FontAwesomeIcon},
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .card--location{
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
      small {margin-right: 5%;}
    }

  }

</style>
