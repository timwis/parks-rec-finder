<template>
    <pprf-sidebar>
        <header v-if="program_id" class="pprf-sidebar-header">
            {{program_id}}
        </header>
        <main class="pprf-sidebar-main">
        </main>
    </pprf-sidebar>
</template>

<script>
// import { mapState } from 'vuex'
import store from '@/store'
import _ from 'underscore'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'

export default {
  name: 'PPRF-Sidebar-Program-Detail-Container',

  props: ['program_id'],

  components: {
    pprfSidebar
  },

  beforeRouteEnter (to, from, next) {
    let programsInState = _.where(store.state.entities.program, {program_id: to.params.program_id})

    if (programsInState.length > 0) {
      store.dispatch('updateEntities', {entities: {program: programsInState[0]}})
      next()
    } else {
      api.getProgramByProgramID(to.params.program_id)
       .then(results => {
         next(vm => {
           vm.$store.dispatch('updateEntities', {type: 'program', data: results.data})
         })
       })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
