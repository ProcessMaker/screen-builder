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
      @input="updateInput"
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
import Inputmasked from './form-input-masked';
import { TheMask } from 'vue-the-mask';

const uniqIdsMixin = createUniqIdsMixin();
const componentTypes = {
  currency: 'inputmasked',
  date: 'the-mask',
  datetime: 'the-mask',
  percentage: 'inputmasked',
};
const componentTypesConfigs = {
  currency: 'getCurrencyFormat',
  date: 'getDateFormat',
  datetime: 'getDatetimeFormat',
  percentage: 'getPercentageFormat',
};

export default {
  inheritAttrs: false,
  components: { TheMask, Inputmasked },
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
      return value;
    },
    convertFromData(value) {
      if (this.dataFormat === 'percentage') return value * 100;
      return value;
    },
    updateInput(value)
    {
      if (this.componentType === 'input') {
        this.localValue = value.target.value;
      }
    },
  },
  computed: {
    componentConfig() {
      const config = componentTypesConfigs[this.dataFormat];
      return Object.assign({}, (config ? this[config] : {}) , this.$attrs);
    },
    getCurrencyFormat() {
      const separators = this.dataMask && this.dataMask ? this.dataMask && this.dataMask.format.match(/[.,]/g) : ['.', ','];
      if (separators.length === 0) separators.push('', '');
      else if (separators.length === 1) separators.splice(0, 0, '');
      return {
        decimal: separators[1],
        thousands: separators[0],
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
      validationRules: {
        'percentage': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
      },
    };
  },
};
</script>
