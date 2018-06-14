<template lang="pug">
  div#application
    SiteHeader(title='Finder')
    div.row
      div.columns.medium-6
        p List
      div.columns.medium-18
        p Map
</template>


<script>
import 'phila-standards/dist/css/phila-app.min.css'

import SiteHeader from './components/SiteHeader'

export default {
  name: 'app',
  components: {
    SiteHeader
  }
}
</script>
