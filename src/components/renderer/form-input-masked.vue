<template>
  <input type="text" class="form-control" @keyup="keyup" v-model="currencyValue" ref="currencyInput" >
</template>

<script>
import Inputmask from 'inputmask';

export default {
  props: {
    value: null,
    decimal: {
      type: String,
      default: ',',
    },
    thousands: {
      type: String,
      default: '.',
    },
    prefix: {
      type: String,
      default: '$ ',
    },
    suffix: {
      type: String,
      default: ' USD',
    },
    precision: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    currencyInput() {
      return this.$refs.currencyInput;
    },
  },
  data() {
    return {
      currencyValue: '',
      unformattedValue: null,
    };
  },
  watch: {
    value: {
      handler(value) {
        value != this.unformattedValue ? this.currencyInput.inputmask.setValue(value) : null;
      },
    },
    currencyValue() {
      this.handleInput();
    },
  },
  methods: {
    loadMasks() {
      const mask = (this.suffix).trim() === 'INR' ? 'indianns' : 'currency';

      Inputmask(mask,  {
        digits: this.precision,
        prefix: this.prefix,
        suffix: this.suffix,
        radixPoint: this.decimal,
        groupSeparator: this.thousands,
      }).mask(this.currencyInput);

      if (this.value) {
        this.currencyInput.inputmask.setValue(this.value);
      }
    },
    keyup(event) {
      // Workaround for a bug in inputmask where backspacing after
      // the decimal does not trigger an input event
      if (this.currencyValue !== event.target.value) {
        this.currencyValue = event.target.value;
      } else {
        this.handleInput();
      }
    },
    handleInput() {
      this.unformattedValue = parseFloat(
        this.currencyInput.inputmask.unmaskedvalue().replace(',', '.')
      );
      this.$emit('input', this.unformattedValue || 0);
    }
  },
  mounted() {
    this.loadMasks();
  },
};
</script>

<style>
</style>
