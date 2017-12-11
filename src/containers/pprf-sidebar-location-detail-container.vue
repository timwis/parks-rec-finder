<template>
    <pprf-sidebar
      modifier-class="nopad"
    >

        <div
          slot="sidebar-header"
          v-if="facility"
          class="pprf-sidebar-header program__header text-center"
        >
          <h3 class="text-center">{{facility.long_name}}</h3>
        </div>

        <div
          v-if="facility"
          slot="sidebar-main"
          class="program--content"
        >

          <section
            v-if="facility.address"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Location</h4>
            <address>
              {{facility.address.street}}
              {{facility.address.city}},
              {{facility.address.zip}}
            </address>
            <!-- <router-link :to="'/location/'+program.location_id">View this location</router-link> -->
          </section>

          <section
            v-if="facility.contact_phone"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Contact</h4>
            <a :href="'tel:'+facility.contact_phone">{{facility.contact_phone}}</a>
          </section>

          <section
            v-if="facility.programs.length"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">Programs</h4>
            <ul>
              <li v-for="programName in facility.programs">{{programName}}</li>
            </ul>
          </section>

          <section
            v-if="facility.facility_description"
            class="program__content-section"
          >
            <h4 class="program__content-section__heading">About This Location</h4>
            <p>{{facility.facility_description}}</p>
          </section>

        </div>

    </pprf-sidebar>
</template>

<script>
import {mapState} from 'vuex'
import pprfSidebar from '@/components/pprf-sidebar'
import api from '@/sources/api'

export default {
  name: 'PPRF-Sidebar-Location-Detail-Container',

  props: ['facility_id'],

  components: {
    pprfSidebar
  },

  beforeRouteEnter (to, from, next) {
    api.getFacilityByID(to.params.facility_id)
        .then(results => {
          next(vm => {
            vm.$store.dispatch('updateEntities', { facility: results.data.rows })
          })
        })
  },

  computed: {
    ...mapState({
      facility: state => state.entities.facility[0]
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
