<template>
  <component
    :class="disabled ? 'button button--disabled' : 'button'"
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
  /**
   * [Phila Standards button](http://standards.phila.gov/guidelines/design-development/components/buttons/)
   *
   * Renders either a button or an anchor link
   */
  export default {
    name: 'phila-button',

    props: {
      /**
       * link
       * @type {String}
       */
      href: {
        type: String
      },
      /**
       * Disabled state
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      /**
       * Click handler
       * @param  {object} e native event object
       * @return {void}
       *
       * @public
       * @since 0.1.0
       */
      onClick (e) {
        /**
         * Enits on element click
         */
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="scss" >
  .button {
    padding: .2rem;
    margin: .5rem 0;
    border: none;
    outline: none;
    background: color(ben-franklin-blue);
  }
  .button[disabled] {
    background: color(sidewalk);
    pointer-events:none;
    cursor: alia;
  }
</style>
