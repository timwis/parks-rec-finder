import {EventBus} from '@/event-bus'
let scrollListToMapPinMixin = {

  mounted () {
    EventBus.$on('map:markerClick', ({type, id}) => {
      this.selectCard(type, id)
    })
  },

  data () {
    return {
      scrollOptions: {
        container: '.scrollable.entity-list-container',
        easing: 'ease-in',
        onDone: function () {},
        x: false,
        y: true
      },
      activeCardID: null
    }
  },

  methods: {
    /*
    * scroll to selected card
    *
    * @since 0.1.0
    */
    selectCard (type, id) {
      console.log(`#${type}--${id}`)
      this.activeCardID = id
      this.$scrollTo(`#${type}--${id}`, 100, this.scrollOptions)
    }
  }

}
export default scrollListToMapPinMixin
