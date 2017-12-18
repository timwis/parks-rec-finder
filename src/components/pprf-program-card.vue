<template>
  <div :class="['card', 'card--program', {'card--program--selected': selected}]">
    <div class="card__info">

      <h3 v-if="name" class="card__info-name text-nopad">
        <router-link :to="'/program/'+programID">{{name}}</router-link>
      </h3>

      <div class="card__info-meta">
        <small><p v-if="ages">
            <span class="card__info-meta__label" >Ages:</span>  {{ages.low}}-{{ages.high}}</p>
        </small>
        <small><p v-if="gender">
          <span class="card__info-meta__label">Gender:</span> {{gender}}</p>
        </small>
        <small><p v-if="fee">
          <span class="card__info-meta__label">Cost:</span> ${{fee}}</p>
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
    programID: {
      type: String
    },
    location: {
      type: Object
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
      height: 80px;
      display:flex;
      flex-direction:column;
      flex:2;
    }

    .card__info-name{
      flex-grow: 1;
    }
    .card__info-meta{
      display: flex;
      small {margin-right: 5%;}
    }

    .card--location{flex:1;}

  }

</style>
