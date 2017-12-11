<template>
    <pprf-sidebar
      modifier-class="nopad"
    >
        <div
          slot="sidebar-header"
          v-if="program"
          class="program__header text-center"
        >
        <div>
        </div>
            <h3 class="text-center">{{program.program_name}}</h3>
            <div class="card__info-meta">
              <small><p>Ages {{program.age_low}}-{{program.age_high}}</p></small>
              <small><p>Gender: {{program.gender}}</p></small>
              <small><p>Cost: ${{program.fee}}</p></small>
            </div>
            <p><i>Registration is {{program.active ? 'open' : 'closed'}}</i></p>
        </div>

        <div
          slot="sidebar-main"
          class="program--content"
        >

          <section class="program__content-section">
            <h4 class="program__content-section__heading">Location</h4>
            <p><b>{{program.facility_name}}</b>| </p>
            <address>
              {{program.address.street}}
              {{program.address.city}},
              {{program.address.zip}}
            </address>
            <router-link :to="'/location/'+program.location_id">View this location</router-link>
          </section>

           <section
            v-if="program.contact"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Contact</h4>
            <p>{{program.contact.phone}}</p>
          </section>

          <!-- only to be added once data is cleaned -->
          <!-- <section
            v-if="program.program_description"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">About The Program</h4>
            <div v-html="program.program_description"></div>
          </section> -->

          <section
            v-if="program.days"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Program Schedule</h4>
            <p><b>XXXXdays and XXXXdays</b></p>
            <p>Start Date: {{program.start_date}}</p>
            <p>End Date: {{program.end_date}}</p>
            <p>Frequency: XXXXXXX</p>
          </section>

          <section>
            <h4 class="program__content-section__heading">Registration Information</h4>
            {{registrationText}}
          </section>


        </div>

    </pprf-sidebar>
</template>

<script>
import {mapState} from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'

export default {
  name: 'PPRF-Sidebar-Program-Detail-Container',

  props: ['program_id'],

  components: { pprfSidebar },

  beforeRouteEnter (to, from, next) {
    api.getProgramByID(to.params.program_id)
        .then(results => {
          next(vm => {
            vm.$store.dispatch('updateEntities', { program: results.data.rows })
          })
        })
  },

  computed: {
    ...mapState({
      program: state => state.entities.program[0],
      registrationText: state => state.programRegistrationText
    })
  }
}
</script>

<style lang="scss" scoped>

.card__info-meta{
  display: flex;
  justify-content: center;
  small {margin-right: 5%;}
}
.program__content-section{
  width: 100%;
  display:block;
  margin-bottom:50px;
}
.program__content-section__heading{
  margin:0;
  padding:0;
}
</style>
