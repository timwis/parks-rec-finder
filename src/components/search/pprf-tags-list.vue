<template>
  <div class="pprf-tags-list">

    <h5 class="screen-reader-text">Applied Search Filters:</h5>
    <ul class="pprf-tags-list__list">
     <li
     v-for="(value, key) in tags"
     class="pprf-tags-list__list-item"
     >
     <button class="pprf-tags-list__tag">{{value}} <font-awesome-icon icon="times" size="xs" class="pprf-tags-list__tag-btn" @click="onTagClick({[key]: value})" />
     </button>
   </li>
 </ul>
</div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {

  name: 'PPRF-Tags-List',

  components: {FontAwesomeIcon},

  props: {
    onTagClick: {
      type: Function
    },

    tags: {
      type: Object
    },

    screenReaderText: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang="scss" scoped>
.pprf-tags-list{
  width: 100%;
  display:flex;
}

.pprf-tags-list__list{
  display: flex;
  margin:0;
  padding:0;
  list-style:none;
}

.pprf-tags-list__tag{
  display: flex;
  border: none;
  border-radius: 10px;
  padding-top: 2px;
  background: lighten(color(sidewalk), 5%);
  margin:0px 5px 5px 5px;
  @include rem(font-size, 1.25);
}

.svg-inline--fa.pprf-tags-list__tag-btn{
  margin:3px 0px 3px 8px;
  opacity: 0.5;
  transition: all 0.5s ease;
  &:hover{
    opacity: 1;
    cursor: pointer;
    cursor: hand;
  }
}



</style>
