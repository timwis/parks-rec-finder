<template>
  <div class="card card--program">
    <div class="card-info">
      <h3 class="card-info-name text-nopad">{{name}}</h3>
      <div class="card-info-meta">
        <small><p>Age: {{ages.high}}-{{ages.low}}</p></small>
        <small><p>Gender: {{gender}}</p></small>
        <small><p>Cost: {{Fee}}</p></small>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'PPRF-Program-Card',
  functional: true,
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
