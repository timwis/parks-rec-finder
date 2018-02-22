<template lang="pug">
  header.site-header.app.group
    div.row.expanded
      div.columns
        a.logo(href='https://beta.phila.gov')
          img(src='http://standards.phila.gov/img/logo/city-of-philadelphia-yellow-white.png' alt='City of Philadelphia')
        div.app-divide
        div.page-title-container
          a(href='/')
            h1.page-title {{ title }}
            h2.page-subtitle(v-if="subtitle") {{ subtitle }}
</template>

<script>
export default {
  name: 'SiteHeader',
  props: [ 'title', 'subtitle' ]
}
</script>
