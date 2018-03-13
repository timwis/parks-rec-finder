<template lang="pug">
  div#application
    SiteHeader(title='Finder')
    main
      aside.list
        router-view
      section.map
        Map
</template>


<script>
import 'phila-standards/dist/css/phila-app.min.css'

import SiteHeader from './components/SiteHeader'
import Map from '~/components/Map'

export default {
  name: 'app',
  components: {
    SiteHeader,
    Map
  }
}
</script>

<style lang="sass">
main
  display: grid
  grid-template-columns: minmax(200px, 3fr) 9fr
  grid-template-rows: calc(100vh - 73px)
  grid-template-areas: "list map"

  .list
    grid-area: list

  .map
    grid-area: map
</style>
