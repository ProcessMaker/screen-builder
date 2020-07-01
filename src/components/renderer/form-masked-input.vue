<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <component
      v-if="componentType!=='input'"
      :is="componentType"
      v-model="localValue"
      v-bind="componentConfig"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      type="text"
    />
    <input v-else
      v-model="localValue"
      v-bind="componentConfig"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      :type="dataType"
      :maxlength="maxlength"
    >
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
import { getUserDateFormat, getUserDateTimeFormat, getTimezone } from '@processmaker/vue-form-elements/src/dateUtils';
import moment from 'moment';

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

const defaultMask = {
  date: ['##/##/####'],
  dateTime: ['##/##/#### #:## SS', '##/##/#### ##:## SS'],
};

const masks = {
  'MM/DD/YYYY': defaultMask,
  'MM/DD/YYYY h:mm A': defaultMask,
  'MM/DD/YYYY HH:mm': {
    date: ['##/##/####'],
    dateTime: ['##/##/#### ##:##'],
  },
  'DD/MM/YYYY': defaultMask,
  'DD/MM/YYYY HH:mm': {
    date: ['##/##/####'],
    dateTime: ['##/##/#### ##:##'],
  },
  'YYYY/MM/DD': {
    date: ['####/##/##'],
    dateTime: ['####/##/## ##:##', '####/##/## #:## SS', '####/##/## ##:## SS'],
  },
  'YYYY/MM/DD HH:mm': {
    date: ['####/##/##'],
    dateTime: ['####/##/## ##:##', '####/##/## #:## SS', '####/##/## ##:## SS'],
  },
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
    getUserDateFormat,
    getUserDateTimeFormat,
    convertToData(value) {
      return value;
    },
    convertFromData(value) {
      if (this.dataFormat === 'datetime') return moment(value).format(this.getUserDateTimeFormat());
      if (this.dataFormat === 'date') return moment(value).format(this.getUserDateFormat());
      return value;
    },
    getMask() {
      const format = this.dataFormat === 'date' ? this.getUserDateFormat() : this.getUserDateTimeFormat();
      return typeof masks[format] === 'undefined'
        ? defaultMask
        : masks[format];
    },
  },
  computed: {
    maxlength() {
      if (this.dataFormat === 'int' || this.dataFormat === 'float') {
        return 15;
      }
      return null;
    },
    componentConfig() {
      const config = componentTypesConfigs[this.dataFormat];
      return Object.assign({}, (config ? this[config] : {}) , this.$attrs);
    },
    getCurrencyFormat() {
      const format = this.dataMask && this.dataMask ? this.dataMask && this.dataMask.format : null;
      const separators = format ? format.match(/[.,]/g) : ['.', ','];
      if (separators.length === 0) separators.push('', '.');
      else if (separators.length === 1) separators.push(separators[0] === '.' ? ',': '.');
      const presicion = format ? (format.split(separators[1])[1] || '').length : 2;
      return {
        decimal: separators[1],
        thousands: separators[0],
        prefix: this.dataMask && this.dataMask.symbol ? this.dataMask.symbol + ' ' : '',
        suffix: this.dataMask && this.dataMask.code ? ' ' + this.dataMask.code : '',
        precision: presicion,
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
        mask: this.getUserConfig().date_mask || this.getMask().date,
      };
    },
    getDatetimeFormat() {
      return {
        masked: true,
        mask: this.getUserConfig().datetime_mask || this.getMask().dateTime,
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
    dataType() {
      if (this.dataFormat === 'password') {
        return 'password';
      }

      return 'text';
    },
  },
  watch: {
    value(value) {
      if (!value) {    
        this.localValue = value;
      } else {
        let date;
        switch(this.dataFormat) {
          case 'date': 
            date = moment(value, moment.ISO_8601, true).tz(getTimezone());
            if (date.isValid()) {
              this.localValue = date.format(getUserDateFormat());
            }
            break;
          case 'datetime': 
            date = moment(value, moment.ISO_8601, true).tz(getTimezone());
            if (date.isValid()) {
              this.localValue = date.format(getUserDateTimeFormat());
            }
            break;
          default:
            value !== this.localValue ? this.localValue = this.convertFromData(value) : null;
            break;
        }
      }      
    },
    localValue(value) {
      if (value == this.value) {
        this.localValue = this.convertFromData(value);
      } else {
        this.$emit('input', this.convertToData(value));
      }
    },
  },
  data() {
    return {
      validator: null,
      localValue: null,
      validationRules: {
        'percentage': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
      },
    };
  },
  mounted() {
    if (this.value) {
      this.localValue = this.value;
    }
  },
};
</script>
