<template>
  <component
    class="phila-button"
    :is="href ? 'a' : 'button'"
    :href="href"
    :disabled="disabled"
    @click="onClick">
    <div class="valign">
      <div class="button-label valign-cell"><slot/></div>
    </div>
  </component>
</template>

<script>
  export default {
    name: 'phila-button',

    props: {
      href: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      onClick (e) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="scss" >
  .phila-button {
    padding: .2rem;
    margin: .5rem 0;
    border: none;
    outline: none;
    background: color(ben-franklin-blue);
  }
  .phila-button[disabled] {
    background: color(sidewalk);
    pointer-events:none;
    cursor: alia;
  }
</style>
