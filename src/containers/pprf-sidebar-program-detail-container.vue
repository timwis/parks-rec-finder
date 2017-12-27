<template>
    <pprf-sidebar
      class="pprf-sidebar--nopad"
    >
        <div
          slot="sidebar-header"
          v-if="program"
          class="entity-detail__header entity-detail__header--program text-center"
        >
            <h3 class="pprf-sidebar__title pprf-sidebar__title--detail">{{program.program_name}}</h3>
            <div class="entity-detail__header-meta">
              <small><p>Ages {{program.age_low}}-{{program.age_high}}</p></small>
              <small><p>Gender: {{program.gender}}</p></small>
              <small><p>Cost: {{program.fee != "Free" ? '$'+program.fee : program.fee }}</p></small>
            </div>
            <p class="entity-detail__reg-status"><i>Registration is {{program.active ? 'open' : 'closed'}}</i></p>
        </div>


        <div
          slot="sidebar-main"
          class="program--content scrollable"
          v-if="program"
        >
          <pprf-detail-content-section
            v-if="program.address"
            heading="Location"
            icon="map-marker-alt"
          >
            <address >
              <p class="text-nopad">
                  <b>{{program.facility_name}}</b>|
                      {{program.address.street}}
                      {{program.address.city}},
                      {{program.address.zip}}
              </p>
            </address>

            <router-link :to="'/location/'+program.location_id">View this location</router-link>
          </pprf-detail-content-section>


          <pprf-detail-content-section
            v-if="program.start_date"
            heading="Program Schedule"
            icon="calendar-alt"
          >
            <p class="text-nopad">
              <b v-for="(value, key, index) in days">{{value}} </b>
            </p>
            <p class="text-nopad" >Start Date: {{program.start_date}}</p>
            <p class="text-nopad" >End Date: {{program.end_date}}</p>
            <!-- <p>Frequency: XXXXXXX</p> -->

          </pprf-detail-content-section>


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


          <pprf-detail-content-section
            heading="Registraion Information"
            icon="info-circle"
          >
            <p>To sign up or learn more, use the information listed here!</p>
          </pprf-detail-content-section>



        </div>

    </pprf-sidebar>
</template>

<script>
import {mapState} from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import pprfDetailContentSection from '@/components/pprf-detail-content-section'
import api from '@/sources/api'

export default {
  name: 'PPRF-Sidebar-entity-detail-Container',

  props: ['program_id'],

  components: {
    pprfSidebar,
    pprfDetailContentSection
  },

  beforeRouteEnter (to, from, next) {
    api.getProgramByID(to.params.program_id)
        .then(results => {
          next(vm => {
            results[0].data.rows[0].days = results[1].data.rows
            vm.$store.dispatch('updateEntities', { program: results[0].data.rows })
            vm.$store.dispatch('setMapMarkers', { entityType: 'program' })
          })
        })
  },

  computed: {
    ...mapState({
      program: state => state.entities.program[0]
    }),
    days () {
      let _days = this.program.days.map((day, idx, array) => {
        let _day = day.days_name + 's'

        if (array.length > 2 & idx < array.length - 1) {
          _day = _day + ' ,'
        }
        return _day
      })

      if (this.program.days.length > 1) {
        _days.splice(_days.length - 1, 0, ' and ')
      }

      return _days
    }
  }
}
</script>

<style lang="scss" scoped>
.entity-detail__header--program{
  background: color(ben-franklin-blue);
}
.program--content{padding-top: 20px;}
.entity-detail__header-meta{color: $white;}
.pprf-sidebar__title--detail{
  color: $white;
  @include rem(font-size, 2.4);
  padding: 20px 0;
  margin:0;
}

.entity-detail__reg-status {
  width: 100%;
  background: $white;
  color: color(dark-gray);
  padding: 10px 0;
}

.entity-detail__header-meta{
  display: flex;
  justify-content: center;
  small {margin-right: 5%;}
  p{margin:0; padding:0;}
}

</style>
