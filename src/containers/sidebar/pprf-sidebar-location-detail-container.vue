<template>

    <pprf-sidebar
      class="pprf-sidebar--nopad pprf-sidebar--entity-detail"
    >
        <div
          slot="sidebar-header"
          v-if="facility"
          class="pprf-sidebar-header entity-detail__header--location text-center"
        >
          <font-awesome-icon
            size="3x"
            icon="map-marker-alt"
            class="entity-detail__header-icon"
          />
          <h3 class="pprf-sidebar__title pprf-sidebar__title--detail text-center">{{facility.long_name}}</h3>
        </div>

        <div
          v-if="facility"
          slot="sidebar-main"
          class="program--content scrollable"
        >
          <pprf-detail-content-section
            heading="Location"
            icon="map-marker-alt"
          >
             <address>
              {{facility.address.street}}
              {{facility.address.city}},
              {{facility.address.zip}}
            </address>
            <a class="program-detail__directions" :href="gmapsLink" target="_blank">Get directions <font-awesome-icon icon="external-link-alt" size="s" /></a>
          </pprf-detail-content-section>


          <pprf-detail-content-section
            v-if="facility.contact_phone"
            heading="Contact"
            icon="phone"
          >
            <a class="program-detail__phone" :href="'tel:'+facility.contact_phone">{{facility.contact_phone}}</a>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            heading="Site contact"
            v-if="facility.location_contact_name.first"
            icon="user"
          >
            <p>{{facility.location_contact_name.first}} {{facility.location_contact_name.middle}} {{facility.location_contact_name.last}}</p>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            v-if="facility.facility_description"
            class="program__content-section program-detail__about"
            heading="About this location"
           >
            <p>{{facility.facility_description}}</p>
          </pprf-detail-content-section>


          <section
            v-if="facilityPrograms.length"
            class="program__content-section"
          >
          <pprf-collapsable-content
            class="facility-detail__programs"
            :title="programsListTitle"
           >
            <ul class="program-detail__programs-list">
              <li
                v-for="program in facilityPrograms"
                :key="program.id"
              >

                <router-link
                  :class="['program-detail__programs-list__item', {'program-detail__programs-list__item-prev': previousProgramID == program.id}]"
                  :to="'/program/'+program.id"
                >
                <font-awesome-icon
                  v-if="previousProgramID == program.id"
                  icon="chevron-left"
                />
                  {{program.program_name}}
                </router-link>
              </li>
            </ul>
          </pprf-collapsable-content >
          </section>

        </div>

    </pprf-sidebar>
</template>

<script>
import api from '@/sources/api'
import {mapState} from 'vuex'

import pprfSidebar from '@/components/pprf-sidebar'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pprfDetailContentSection from '@/components/pprf-detail-content-section'
import pprfCollapsableContent from '@/components/pprf-collapsable-content'

export default {
  name: 'PPRF-Sidebar-Location-Detail-Container',

  props: ['facility_id'],

  components: {
    pprfSidebar,
    FontAwesomeIcon,
    pprfDetailContentSection,
    pprfCollapsableContent
  },

  beforeRouteEnter (to, from, next) {
    api.getFacilityByID(to.params.facility_id)
        .then(results => {
          next(vm => {
            if (results[0].data.rows[0].location_contact_name) {
              /* eslint-disable no-eval */
              var parsedJSON = eval('(' + results[0].data.rows[0].location_contact_name + ')')
              results[0].data.rows[0].location_contact_name = parsedJSON
            }

            vm.$store.dispatch('updateEntities', { facility: results[0].data.rows, program: results[1].data.rows })
            vm.$store.dispatch('setMapMarkers', { entityType: 'facility' })
          })
        })
  },

  computed: {
    ...mapState({
      facility: state => state.entities.facility[0],
      facilityPrograms: state => state.entities.program
    }),
    previousProgramID () {
      if (this.$store.state.route.from.params.program_id) {
        return this.$store.state.route.from.params.program_id
      }
      return null
    },
    programsListTitle () {
      let activityWord = this.facilityPrograms.length === 1 ? 'activity' : 'activities'
      return `${this.facilityPrograms.length} ${activityWord} offered here`
    },
    gmapsLink () {
      const { street, city, zip } = this.facility.address
      const fullAddress = [ street, city, zip ].join(', ')
      return `https://www.google.com/maps/search/?api=1&query=${fullAddress}`
    }
  }
}
</script>

<style lang="scss" scoped>
.entity-detail__header--location{
  background: #A5097E;
}
.entity-detail__header-icon{
  color: $white;
  margin-top:20px;
}

.program-detail__directions{
  .svg-inline--fa{vertical-align: 0%; margin-left: 3px;}
}
.pprf-detail-section a.program-detail__phone{
  @include rem(font-size, 1.4);

  color: $black;
  text-decoration: none;
  font-family: $font-montserrat;
  font-weight: 100;
}
.pprf-sidebar__title--detail{
  color: $white;
  @include rem(font-size, 2.4);
  padding: 20px 0;
  margin:0;
}

.program-detail__programs-list{
  list-style: none;
  margin: 0;
  padding:0 0 0 20px;
}

.program-detail__programs-list__item{
  text-decoration: none;
  @include rem(font-size, 1.5);
  color: color(dark-ben-franklin);
}
.program-detail__programs-list__item-prev{
  font-weight: 700;
  .svg-inline--fa{ vertical-align: -6%; }
}

.program-detail__about{
  p{margin-top:0; padding:0;}
}

.entity-detail__reg-status {
  width: 100%;
  background: $white;
  color: color(dark-gray);
  padding: 10px 0;
}

.card__info-meta{
  display: flex;
  justify-content: center;
  small {margin-right: 5%;}
}


</style>
