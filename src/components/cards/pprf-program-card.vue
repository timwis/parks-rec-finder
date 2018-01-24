<template>
  <div
    :class="['card', 'card--program', {'card--selected': selected, 'card--nested-parent': location, 'card--within-zip': withinZipcode !== 'undefined' && withinZipcode, 'card--outside-zip': withinZipcode !== 'undefined' && !withinZipcode}]"
    :id="'program--'+programID"
  >
    <div class="card__info">
      <div class="card__info-name">
        <h3 class="text-nopad">
          <router-link class="text-nopad" v-if="name"  :to="'/program/'+programID">{{name}}</router-link>
        </h3>
      </div>


      <div class="card__info-meta">
        <p v-if="ages">
          <span class="card__info-meta__label">Ages:</span> <span>{{ages.low}}-{{ages.high}}</span>
        </p>
        <p v-if="gender">
          <span class="card__info-meta__label">Gender:</span> {{gender}}
        </p>
        <p v-if="fee">
          <span class="card__info-meta__label">Cost:</span> {{(fee != "" && fee != "0.00" ) ? '$'+fee : 'Free' }} <span v-if="(fee != '' && fee != '0.00' ) && feeFreq" class="fee_frequency text-lower">{{feeFreq}}</span>
        </p>
      </div>
    </div>

    <pprf-location-card
      :nested="true"
      v-if="location"
      :name="location.name"
      :address="location.address"
      :facilityID="location.id"
    />
    <div v-if="withinZipcode !== 'undefined'"  class="card__in-zipcode-bar">
        <h5> {{withinZipcode ? 'within' : 'near'}} zip code</h5>
    </div>
  </div>
</template>

<script>
import pprfLocationCard from '@/components/cards/pprf-location-card'

/**
 * RENDERS A CARD FOR A LOCATION ENTITY
 *
 * This card can be nested inside of a program card.
 */
export default {

  name: 'PPRF-Program-Card',
  components: {pprfLocationCard},
  props: {
    name: {
      type: String
    },
    ages: {
      type: Object
    },
    gender: {
      type: String
    },
    fee: {
      type: String
    },
    feeFreq: {
      type: String
    },
    programID: {
      type: String
    },
    location: {
      type: Object
    },
    withinZipcode: {
      default: 'undefined'
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // bind to prop so we can mutate it
    this.isActive = this.selected
  }
}
</script>

<style lang="scss" scoped>
  .card.card--program{
    display: flex;
    padding: 10px;
    border-bottom: 1px solid color(dark-gray);
    position: relative;
    padding-bottom: 0;


    .card__info{
      display:flex;
      flex-direction:column;
      flex:2;
    }

    .card__info-name{
      flex-grow: 1;
    }
    .card__info-meta{
      display: flex;
      margin-bottom:10px;
      p{
        margin-right: 8%;
        @include rem(font-size, 1.218rem);
        @include rem(line-height, 1.5);
      }

    }
    .fee_frequency{
      font-size: 85%;
    }

    .card--location{flex:1;}

  }

  @media screen and (max-width: 39.9375em) {
    .card.card--location.card--nested{
      display: none !important;
    }
  }

</style>
