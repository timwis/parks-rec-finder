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
              <small><p>Cost: {{(program.fee != "" && program.fee != "0.00" ) ? '$'+program.fee : 'Free' }} <span v-if="(program.fee != '' && program.fee != '0.00' ) && program.fee_frequency" class="entity-detail__fee-frequency text-lower">{{program.fee_frequency}}</span></p></small>
            </div>
            <p class="entity-detail__reg-status nomargin"><b>Registration - </b> {{program.registration_status}}</p>
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

            <router-link v-if="program.facility_is_published" :to="'/location/'+program.location_id">View this location</router-link>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            v-if="program.contact_phone"
            class="program__content-section"
            icon="phone"
            heading="Contact"
          >
            <a class="program-detail__phone" :href="'tel:'+program.contact_phone">{{program.contact_phone}}</a>
          </pprf-detail-content-section>

         <pprf-detail-content-section
            v-if="program.desc_short"
            class="program__content-section program-detail__about"
            heading="About this program"
           >
            <p>{{program.desc_short}}</p>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            v-if="schedules.length"
            heading="Program Schedule(s)"
            icon="calendar-alt"
          >
            <div v-for="schedule in schedules">
              <p class="text-nopad" ><b>Start Date:</b> {{schedule.start_date}}</p>
              <p class="text-nopad" ><b>End Date:</b> {{schedule.end_date}}</p>
              <table class="program__schedule">
                <tr v-for="day in schedule.days"><td>{{day.days_name}}</td> <td>{{schedule.time_from}} - {{schedule.time_to}}</td></tr>
              </table>
            </div>

          </pprf-detail-content-section>

          <pprf-detail-content-section
            heading="Registration Information"
            icon="info-circle"
          >
          <div v-if="program.registration_form_link.url">
            To sign up visit <a
            :href="program.registration_form_link.url">{{program.registration_form_link.url}} <font-awesome-icon icon="external-link-alt" size="xs" /></a>
          </div>
          <div v-else>
            <p>To sign up or learn more use the contact information above.</p>
          </div>

          </pprf-detail-content-section>

        </div>

    </pprf-sidebar>
</template>

<script>
import api from '@/sources/api'
import _ from 'underscore'

import {mapState} from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pprfDetailContentSection from '@/components/pprf-detail-content-section'
import LocalCacheManager from '@/sources/LocalCacheManager'

export default {
  name: 'PPRF-Sidebar-entity-detail-Container',

  props: ['program_id'],

  components: {
    pprfSidebar,
    FontAwesomeIcon,
    pprfDetailContentSection
  },

  beforeRouteEnter (to, from, next) {
    api.getProgramByID(to.params.program_id)
        .then(results => {
          next(vm => {
            let schedules = results[1].data.rows
            // map days to each schedule
            for (var i = 0; i < schedules.length; i++) {
              // find the days records from our cached days table in local storage
              schedules[i].days = schedules[i].days.map(day => _.findWhere(LocalCacheManager.getRow('daysTable'), {id: day}))
            }
            try {
              var formLink =
                results[0].data.rows[0].registration_form_link.replace(/'/g, '"')
              results[0].data.rows[0].registration_form_link = JSON.parse(formLink)
            } catch (e) {
              results[0].data.rows[0].registration_form_link = ''
            }

            vm.schedules = schedules
            vm.$store.dispatch('updateEntities', { program: results[0].data.rows })
            vm.$store.dispatch('setMapMarkers', { entityType: 'program' })
          })
        })
  },

  data () {
    return {
      schedules: [],
      programs: []
    }
  },

  computed: {
    ...mapState({ program: state => state.entities.program[0] })
  }
}
</script>

<style lang="scss" scoped>
.entity-detail__header--program{
  background: color(ben-franklin-blue);
}
.program--content{
  padding-top: 20px;
}
a.program-detail__phone{
  color: $black;
  text-decoration: none;
}
.entity-detail__header-meta{color: $white;}
.pprf-sidebar__title--detail{
  color: $white;
  @include rem(font-size, 2.4);
  line-height: 1.2;
  font-weight: 700;
  padding: 20px 0;
  margin:0;
}

.entity-detail__fee-frequency{
  font-size: 85%;
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

.program__schedule{
  font-family: $font-open-sans;
  @include rem(font-size, 1.4);
  margin-bottom: 20px;
  tr{
    background: color(ghost-gray);
  }
  td{
    padding: 3px 10px;
  }
}

</style>
