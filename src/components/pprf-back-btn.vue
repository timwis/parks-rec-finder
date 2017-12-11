<template>
  <button
    v-if="lastState"
    class="pprf-btn pprf-back-btn text-caps"
    @click.prevent="goBack"
  >
   <font-awesome-icon icon="chevron-left" />
    {{btnTxt}}
</button>
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
        return `Search results for ${previousRoute.parmas.freetext}`
      } else {
        return 'Back'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
