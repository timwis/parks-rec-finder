export default {
  computed: {
    facilities () {
      return this.$store.getters.facilityList
    },
    facilitiesCount (state) {
      return this.$store.getters.facilityListCount
    },

    markers (state) {
      return this.$store.getters.markers
    },

    programs () {
      return this.$store.getters.programList
    },
    programsCount (state) {
      return this.$store.getters.programListCount
    }
  }
}
