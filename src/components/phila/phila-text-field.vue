<template>
  <div class="text-field">
    <label :for="name">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <input
      :type="type"
      :id="name"
      :name="name"
      :class="{ 'input-error': hasError }"
      :value="lazyValue"
      :disabled="disabled"
      :required="required"
      :autofocus="autofocus"
      :aria-required="required"
      :aria-invalid="hasError"
      :tabindex='tabindex'
      @input="onInput"
      ref="input"
    >

    <div class="input-error">
      <!-- <phila-form-error-message
        v-if="hasError"
        role="alert"
        :field="name"
        :label="errorMessageLabel || label"
        :validationMessages="validationMessages">
      </phila-form-error-message> -->
    </div>

  </div>
</template>

<script>
  import Input from './mixins/input'
  // import PhilaFormErrorMessage from './phila-form-error-message.vue'

  /**
   * Phila Standards Input Element
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

    computed: {
      inputValue: {
        get () {
          return this.lazyValue
        },
        set (val) {
          // this.$emit('input', val)
          this.lazyValue = val
        }
      }
    },

    methods: {
      /**
       * Set the inputValue as the user types
       * and updates the `isDirty` prop to true
       *
       * @param  {Object} e input event object
       * @return {Void}
       * @public
       */
      onInput (e) {
        this.inputValue = e.target.value
      }
    }
  }
</script>

<style lang="scss">

  [type='text'], [type='password'], [type='date'], [type='datetime'], [type='datetime-local'], [type='month'], [type='week'], [type='email'], [type='number'], [type='search'], [type='tel'], [type='time'], [type='url'], [type='color'], textarea {
    margin: 0;
    margin-top: 5px;
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
    margin: 0;
    margin-top: 10px;
  }
</style>
