<template>
  <div
    :class="['card', 'card--program', {'card--selected': selected, 'card--nested-parent': location, 'card--within-zip': withinZipcode !== 'undefined' && withinZipcode, 'card--outside-zip': withinZipcode !== 'undefined' && !withinZipcode}]"
    :id="'program--'+programID"
  >
    <div class="card__info">

        <router-link class="card__info-name text-nopad" v-if="name"  :to="'/program/'+programID">
          <h3 class="text-nopad">{{name}}</h3>
        </router-link>

      <div class="card__info-meta">
        <small><p v-if="ages">
            <span class="card__info-meta__label" >Ages:</span>  {{ages.low}}-{{ages.high}}</p>
        </small>
        <small><p v-if="gender">
          <span class="card__info-meta__label">Gender:</span> {{gender}}</p>
        </small>
        <small><p v-if="fee">
          <span class="card__info-meta__label">Cost:</span> ${{fee}} <span v-if="feeFreq" class="fee_frequency text-lower">{{feeFreq}}</span></p>
        </small>
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
import pprfLocationCard from '@/components/pprf-location-card'

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
    distance: {
      type: Number
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
      small {margin-right: 5%;}
    }
    .fee_frequency{
      font-size: 85%;
    }

    .card--location{flex:1;}

  }

</style>
