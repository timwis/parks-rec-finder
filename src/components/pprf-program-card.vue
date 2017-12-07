<template>
  <div class="card card--program">
    <div class="card__info">
      <router-link :to="'/program/'+programID">
        <h3 v-if="name" class="card__info-name text-nopad">{{name}}</h3>
      </router-link>

      <div class="card__info-meta">
        <small><p v-if="ages">Ages {{ages.low}}-{{ages.high}}</p></small>
        <small><p v-if="gender">Gender: {{gender}}</p></small>
        <small><p v-if="fee">Cost: ${{fee}}</p></small>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'PPRF-Program-Card',

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
    }
  }
}
</script>

<style lang="scss" scoped>
  .card--program{
    padding: 10px;
    border-bottom: 1px solid color(dark-gray);
    position: relative;
    padding-bottom: 0;

    .card__info{
      height: 80px;
      display:flex;
      flex-direction:column;
    }

    .card__info-name{flex-grow: 1;}
    .card__info-meta{
      display: flex;
      small {margin-right: 5%;}
    }

  }

</style>
