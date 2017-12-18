<template>
    <pprf-sidebar
      class="pprf-sidebar--nopad"
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
            <a :href="gmapsLink(facility.latitude, facility.longitude)" target="_blank">Get Directions <font-awesome-icon icon="external-link-alt" size="xs" /></a>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            v-if="facility.contact_phone"
            heading="Contact"
            icon="phone"
          >
            <a :href="'tel:'+facility.contact_phone">{{facility.contact_phone}}</a>
          </pprf-detail-content-section>

          <pprf-detail-content-section
            v-if="facility.facility_description"
            class="program__content-section"
            heading="About this location"
           >
            <p>{{facility.facility_description}}</p>
          </pprf-detail-content-section>

          <section
            v-if="facilityPrograms.length"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Programs</h4>
            <ul>
              <li v-for="program in facilityPrograms">
                <router-link :to="'/program/'+program.program_id">
                  {{program.program_name}}
                </router-link>
              </li>
            </ul>
          </section>

        </div>

    </pprf-sidebar>
</template>

<script>
import {mapState} from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pprfDetailContentSection from '@/components/pprf-detail-content-section'
import api from '@/sources/api'

export default {
  name: 'PPRF-Sidebar-Location-Detail-Container',

  props: ['facility_id'],

  components: {
    pprfSidebar,
    FontAwesomeIcon,
    pprfDetailContentSection
  },

  beforeRouteEnter (to, from, next) {
    api.getFacilityByID(to.params.facility_id)
        .then(results => {
          next(vm => {
            vm.$store.dispatch('updateEntities', { facility: results[0].data.rows, program: results[1].data.rows })
            vm.$store.dispatch('setMapMarkers', { entityType: 'facility' })
          })
        })
  },

  computed: {
    ...mapState({
      facility: state => state.entities.facility[0],
      facilityPrograms: state => state.entities.program
    })
  },
  methods: {
    gmapsLink (lat, lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    }
  }
}
</script>

<style lang="scss" scoped>
.entity-detail__header--location{
  background: color(pride-purple);
}
.entity-detail__header-icon{
  color: $white;
  margin-top:20px;
}
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

.card__info-meta{
  display: flex;
  justify-content: center;
  small {margin-right: 5%;}
}
</style>
