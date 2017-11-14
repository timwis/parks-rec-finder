<template>
  <div :class="'text-field ' + name">
    <label :id="name+'__label'" :for="name+'__input'">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <input
      :type="type"
      :id="name+'__input'"
      :name="name"
      :class="{ 'input-error': hasError }"
      :value="lazyValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :autofocus="autofocus"
      :aria-required="required"
      :aria-invalid="hasError"
      :tabindex='tabindex'
      @input="onInput"
      @blur="blur"
      @keyup.enter="onEnter"
      @focus="focus"
      ref="input"
    >
  </div>
</template>

<script>
  import Input from './mixins/input'
  // import PhilaFormErrorMessage from './phila-form-error-message.vue'

  /**
   * [Phila Standards Input Element](http://standards.phila.gov/guidelines/design-development/components/forms/)
   */
  export default {
    name: 'phila-text-field',

    mixins: [Input],

    inheritAttrs: false,

    props: {
      name: {
        type: String
      },
      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      errorMessageLabel: {
        type: String
      },
      validationMessages: {
        type: Object
      },
      type: {
        type: String,
        default: 'text'
      },
      autofocus: {
        type: Boolean
      },
      hasError: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String
      }
    },

    mounted () {
      this.autofocus && this.focus()
    },

    computed: {
      /**
       * update the inputValue and emit and input event
       * @type {Object}
       */
      inputValue: {
        get () {
          return this.lazyValue
        },
        set (val) {
          /**
           * Text Field User Input event
           *
           * @event input
           * @type {string}
           */
          this.$emit('input', val)
          this.lazyValue = val
        }
      },
      isDirty () {
        return this.lazyValue !== null &&
          typeof this.lazyValue !== 'undefined' &&
          this.lazyValue.toString().length > 0
      }
    },

    watch: {
      focused (val) {
        if (val) {
          this.initialValue = this.lazyValue
        } else if (this.initialValue !== this.lazyValue) {
          /*
           * Emits if input element value has changed on blur (un-focused)
           *
           * @event change
           * @type {string}
           * @since 0.0.0
           */
          this.$emit('change', this.lazyValue)
        }
      }
    },

    methods: {
      /**
       * Set the inputValue as the user types
       * and updates the `isDirty` prop to true
       *
       * @param  {object} e input event object
       * @return {void}
       * @public
       * @since 0.0.0
       */
      onInput (e) {
        this.inputValue = e.target.value
      },
      /**
       * on user "enter" kepress emit enter event
       * @param  {object} e keyboard event
       * @return {void}
       * @public
       * @since 0.0.0
       */
      onEnter (e) {
        /**
         * Emits on "enter" keypress
         *
         * @event enter
         * @type {void}
         * @since 0.0.0
         */
        this.$emit('enter', e)
      },
      /**
       * Removes focus from input element and emits blur event
       * @param  {object} e event object
       * @return {void}
       *
       * @public
       * @since 0.0.0
       */
      blur (e) {
        this.focused = false
        /**
         * Emits event on input element blur
         *
         * @event blur
         * @type {oject}
         * @since 0.0.0
         */
        this.$emit('blur', e)
      },
      /**
       * Sets focused state on input element focus
       * @param  {object} e event object
       * @return {Void}
       *
       * @public
       * @since 0.0.0
       */
      focus (e) {
        this.focused = true
        // if (document.activeElement !== this.$refs.input) {
        //   this.$refs.inut.focus()
        // }
        /**
         * Emits on input elemet focus with event object as payload
         *
         * @event focus
         * @type {object}
         * @since 0.0.0
         */
        this.$emit('focus', e)
      }
    }
  }
</script>

<style lang="scss">

  [type='text'], [type='password'], [type='date'], [type='datetime'], [type='datetime-local'], [type='month'], [type='week'], [type='email'], [type='number'], [type='search'], [type='tel'], [type='time'], [type='url'], [type='color'], textarea {
    margin: 0;
  }

  input.input-error {
    border: 1px solid #ca310b;
    margin-bottom: 0;
  }

  div.input-error {
    color: #ca310b;
    height: 20px;
  }

  label {
    position:absolute;
    top:0;
    left:0;
    display:block;
    margin: 0;
    margin-top: 10px;
  }
</style>
