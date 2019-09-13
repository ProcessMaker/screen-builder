<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <component
      :is="componentType"
      v-model="localValue"
      v-bind="componentConfig"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
      type="text"
    />
    <template v-if="validator && validator.errorCount">
      <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
        <div v-for="(error, subIndex) in errors" :key="subIndex">
          {{ error }}
        </div>
      </div>
    </template>
    <div class="invalid-feedback" v-if="error">{{ error }}</div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import ValidationMixin from '@processmaker/vue-form-elements/src/components/mixins/validation';
import DataFormatMixin from '@processmaker/vue-form-elements/src/components/mixins/DataFormat';
import { TheMask } from 'vue-the-mask';
import { Money } from 'v-money';

const uniqIdsMixin = createUniqIdsMixin();
const componentTypes = {
  currency: 'money',
  date: 'the-mask',
  datetime: 'the-mask',
  percentage: 'money', // We use money because it stores properly the unmasked value
};
const componentTypesConfigs = {
  currency: 'getCurrencyFormat',
  date: 'getDateFormat',
  datetime: 'getDatetimeFormat',
  percentage: 'getPercentageFormat',
};

export default {
  inheritAttrs: false,
  components: { TheMask, Money },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'dataMask',
  ],
  methods: {
    getUserConfig() {
      return (window.ProcessMaker && window.ProcessMaker.user) || {};
    },
    convertToData(value) {
      if (this.dataFormat === 'percentage') return value / 100;
      if (this.dataFormat === 'percentage') return value / 100;
      return value;
    },
    convertFromData(value) {
      if (this.dataFormat === 'percentage') return value * 100;
      return value;
    },
  },
  computed: {
    componentConfig() {
      const config = componentTypesConfigs[this.dataFormat];
      return Object.assign({}, (config ? this[config] : {}) , this.$attrs);
    },
    getCurrencyFormat() {
      return {
        decimal: ',',
        thousands: '.',
        prefix: this.dataMask ? this.dataMask.symbol + ' ' : '',
        suffix: this.dataMask ? ' ' + this.dataMask.code : '',
        precision: 2,
        masked: false,
      };
    },
    getPercentageFormat() {
      return {
        decimal: '.',
        thousands: '',
        prefix: '',
        suffix: ' %',
        precision: 2,
        masked: false,
      };
    },
    getDateFormat() {
      return {
        masked: true,
        mask: this.getUserConfig().date_mask || '##-##-####',
      };
    },
    getDatetimeFormat() {
      return {
        masked: true,
        mask: this.getUserConfig().datetime_mask || '##-##-#### ##:##',
      };
    },
    componentType() {
      return componentTypes[this.dataFormat] || 'input';
    },
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
      };
    },
  },
  watch: {
    value(value) {
      value !== this.localValue ? this.localValue = this.convertFromData(value) : null;
    },
    localValue(value) {
      value !== this.value ? this.$emit('input', this.convertToData(value)) : null;
    },
  },
  data() {
    return {
      validator: null,
      localValue: this.value,
      price: 0,
      validationRules: {
        'percentage': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
      },
    };
  },
};
</script>
