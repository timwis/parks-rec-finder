<template>
<router-link
    v-if="$routerHistory.hasHistory()"
    class="pprf-btn pprf-back-btn text-caps"
    :to="{ path: $routerHistory.previous().path }">
    <font-awesome-icon icon="chevron-left" />
    <span>{{btnTxt}}</span>
</router-link>

</template>

<script>
import {mapState} from 'vuex'
import {deSlugify} from '@/utilities/utils'
import _ from 'underscore'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'PPRF-Back-Btn',
  components: {FontAwesomeIcon},
  methods: {
    goBack () {
      this.$emit('backBtnClicked')
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({
      lastState: state => state.route.from.name
    }),
    btnTxt () {
      let previousRoute = this.$store.state.route.from

      if (_.has(previousRoute.params, 'entityTerm')) {
        return deSlugify(previousRoute.params.entityTerm)
      } else if (_.has(previousRoute.params, 'entityType')) {
        return previousRoute.params.entityType
      } else if (previousRoute.name === 'Search') {
        return `Search results for ${previousRoute.query.freetext}`
      } else {
        return 'Back'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pprf-back-btn{
  text-decoration: none;
  font-family: $font-montserrat;
  color: color(dark-ben-franklin);
  padding: 0 0 0 5px;

  span{
    display: inline-block;
    transform: translateY(1px);
  }
  .svg-inline--fa{
    margin-right: 5px;
    transition: all 0.25s ease;
  }
  &:hover{
    .svg-inline--fa{ transform: translateX(-3px);}
  }
}


</style>
