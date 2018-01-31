<template>
  <header class="pprf-header">
    <nav v-if="mobile.navOpen" class="pprf-header__nav-mobile">
        <h1>
            <a href="https://beta.phila.gov/departments/parks-recreation/" class="logo">
              <span class="screen-reader-text">Philadelphia Parks &amp; Recreation - Department Website</span>
              <pprf-logo-svg />
            </a>
        </h1>
        <ul>
          <li>
            <a class="text-upper link-dark-bg" href="http://beta.phila.gov">City of Philadelphia</a>
          </li>
            <li>
                <a @click.prevent="openModal('about')" class="text-upper link-dark-bg" href="">How to use</a>
            </li>
            <li>
                <a class="text-upper link-dark-bg" href="javascript:void(window.open('https://form.jotform.com/80085833214150', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500'))">Feedback</a>
            </li>
        </ul>
        <small class="app-version text-nopad">v{{version}}</small>
    </nav>

    <div class="pprf-header__branding">
      <h1>
        <a href="https://beta.phila.gov/departments/parks-recreation/" class="logo">
          <span class="screen-reader-text">Philadelphia Parks &amp; Recreation - Department Website</span>
          <pprf-logo-svg />
        </a>
      </h1>

      <hr>
        <button @click="toggleMobileNav" class="pprf-btn pprf-header--mobile__nav-icon">
            <font-awesome-icon icon="bars" />
        </button>

        <a href="/parks-rec-finder/" class="link-dark-bg">
            <h2 class="text-nopad">Finder</h2>
            <h3 class="text-nopad">Search for activities, locations, or zip codes.</h3>
        </a>

        <button :disabled="mobile.navOpen" @click.prevent="toggleMobileSearch" class="pprf-header--mobile__search-icon">
            <font-awesome-icon :icon="mobile.searchOpen ? 'times' : 'search' " />
        </button>
    </div>

    <div  :class="['pprf-header__search' ,{'pprf-header__search--mOpen': mobile.searchOpen}]">
      <pprf-search></pprf-search>
    </div>

    <vue-progress-bar></vue-progress-bar>
  </header>
</template>

<script>
import pprfSearch from '@/components/search/pprf-search'
import pprfLogoSvg from '@/components/pprf-logo-svg'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapState } from 'vuex'
import {version} from '../../package.json'
/**
 * HEADER BAR
 *
 * Contains Search, Logo and mobile nav
 *
 * @since 0.1.0
 */
export default {
  name: 'PPRF-Header',
  components: {pprfSearch, FontAwesomeIcon, pprfLogoSvg},
  data () {
    return {
      mSearchOpen: false,
      version
    }
  },
  computed: {
    ...mapState(['mobile'])
  },
  methods: {
    openModal (name) {
      this.toggleMobileNav()
      this.$store.dispatch('toggleMobileSearch', {open: false})
      this.$store.dispatch('toggleModal', {name, open: true})
    },
    toggleMobileSearch () {
      this.$store.dispatch('toggleMobileSearch')
    },
    toggleMobileNav () {
      this.$store.dispatch('toggleMobileNav')
    }
  }
}
</script>

<style lang="scss" >
.pprf-header__nav-mobile{
    display: none;
}
header.pprf-header{
  display:flex;
  flex-direction: row;
  position:relative;

  width: 100%;
  height: $header-height;
  align-items: center;
  padding:10px;

  background: color(dark-ben-franklin);
  .logo{

    &:hover{
      #ppr-logo{
        fill-opacity: .7;
        transition: transform 0.5s ease, fill-opacity 0.5s ease, -webkit-transform 0.5s ease;

      }
    }
  }
}
.app-title h2{
    color:$white;
}
.__cov-progress{
  position: absolute !important;
  top: auto !important;
  bottom: -5px !important;
}

.pprf-header__branding{
  width: 40%;
  min-width: 530px;
  padding: 10px 2rem 10px 0;
  align-items: center;
  display:flex;
  justify-content: space-between;

  hr{
    height: 70px;
    margin: 0 5%;
  }

  h3.text-nopad {
    font-size: 1.1rem;
    margin: -15px 0 0 0;
    padding:0;
  }
}

#ppr-logo {
  max-width: 218px;
  width: 100%;
  display: block;
}

.pprf-header--mobile__nav-icon,
.pprf-header--mobile__search-icon{
    display: none;
    background: none;
    border: none;
}

.pprf-header__search{
  width: 100%;
}

@include breakpoint(medium down) {
  .pprf-header__nav-mobile{
      #ppr-logo{
          display: block;
          margin: 0 auto;
      }
      display: block;
      height: 100vh;
      position: fixed;
      top: $header-height-mobile;
      left:0;
      z-index: 1000000;
      width: 90vw;
      background: lighten(color(dark-ben-franklin), 5%);
      &:after{
          content: '';
          position: absolute;
          top: 0;
          right:-10vw;
          height: 100vh;
          width: 10vw;
          background: rgba(0,0,0,0.5);
      }
      ul {
          list-style: none;
          color: $white;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba($white, 0.5);
          li {
              border-bottom: 1px solid rgba($white, 0.5);
              padding: 0 0 0 30px;
              a{
                  color:$white;
                  text-decoration: none;
                  font-weight: 700;
              }
          }
      }
    .app-version{
        position: absolute;
        bottom: 58px;
        left: 20px;
        color: $white;
      }
  }

  header.pprf-header{
    height: 60px;
    z-index: 50000;
    padding:0;
    flex-direction: column;
    &.pprf-header--mobile-open{ height: 120px; }
  }

    .pprf-header__branding {
        width: 100%;
        min-width: 100%;
        align-items: center;
      justify-content: flex-start;
    }

    #ppr-logo,
    hr {
      display: none;
    }

    .pprf-header--mobile__nav-icon{
        background: none;
        display:block;
        margin: 5px 15px 5px 15px;
        color: $white;
    }

    .pprf-header--mobile__search-icon{
        display:block;
        color: white;
        position: absolute;
        right: 10px;
        top: 10px;
        @include rem(font-size, 3);
      /*  &[disabled]{
            color: color(sidewalk);
        }*/
    }



    .pprf-header__search{
      height:0;
      overflow: hidden;
      width: 100%;
      background: color(sidewalk);
      //position: absolute;
      //left: 50%;
      //bottom: -60px;
      //transform: translateX(-50%);
      z-index: 10000;
      &.pprf-header__search--mOpen{
        height: 60px;
      }
    }
      .pprf-search{
        padding: 10px;
      }

}




</style>
