<template>
  <input type="text" class="form-control" v-model="currencyValue" ref="currencyInput" >
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
      this.unformattedValue = parseFloat(
        this.currencyInput.inputmask.unmaskedvalue().replace(',', '.')
      );
      this.$emit('input', this.unformattedValue || 0);
    },
  },
  methods: {
    loadMasks() {
      Inputmask('currency', {
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
  },
  mounted() {
    this.loadMasks();
  },
};
</script>

<style>
</style>