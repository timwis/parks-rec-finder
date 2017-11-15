export default {
  computed: {
    facilities () {
      return this.$store.getters.facilityList
    },
    facilitiesCount (state) {
      return this.$store.getters.facilityListCount
    },

    programs () {
      return this.$store.getters.programList
    },
    programsCount (state) {
      return this.$store.getters.programListCount
    }
  }
}
