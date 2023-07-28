import Validator from 'validatorjs';
import moment from 'moment-timezone';
import { getUserDateFormat, getUserDateTimeFormat } from '@/dateUtils';

// To include another language in the Validator with variable processmaker
let globalObject = typeof window === 'undefined'
  ? global
  : window;

if (globalObject.ProcessMaker && globalObject.ProcessMaker.user && globalObject.ProcessMaker.user.lang) {
  Validator.useLang(globalObject.ProcessMaker.user.lang);
}

Validator.register('custom-date', function(date) {
  let checkDate = moment(date, [getUserDateFormat(), moment.ISO_8601], true);
  return checkDate.isValid();
}, 'The :attribute must be a valid date.');

Validator.register('custom-datetime', function(date) {
  let checkDate = moment(date, [getUserDateTimeFormat(), moment.ISO_8601], true);
  return checkDate.isValid();
}, 'The :attribute must be a valid date and time.');

export default {
  props: {
    dataFormat: {
      type: String,
      default() {
        return 'string';
      },
    },
  },
  computed:{
    componentName() {
      return this.$vnode.tag ?  this.$vnode.tag.replace(/vue-component-\d+-/i, '') : '';
    }
  },
  data() {
    return {
      dataTypeValidator: null,
      dataTypeValidatorPasses: true,
      formatted: ''
    };
  },
  watch: {
    value(value) {
      const typedValue = this.formatValue(value);
      if (typedValue !== value) {
        if (this.dataFormat === 'date' && this.formatValue(value) === typedValue && this.componentName !== 'FormDatePicker') {
          return;
        }
        this.$emit('input', typedValue);
      }
    },
  },
  methods: {
    formatValueWith(value, format) {
      this.$set(this, 'dataFormat', format);
      return this.formatValue(value);
    },
    formatValue(value) {
      if (!value && this.dataFormat !== 'boolean') {
        return value;
      }
      this.dataTypeValidatorPasses = this.validateRuleFormat(value);
      return this.dataTypeValidatorPasses ? this.formatValueIfValid(value) : value;
    },
    validateRuleFormat(value) {
      if (!this.dataFormat) {
        return true;
      }
      const rules = {
        'int': 'integer',
        'boolean': 'boolean',
        'string': 'string',
        'datetime': 'custom-datetime',
        'date': 'custom-date',
        'float': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
        'currency': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
        'array': 'array',
      };
      if (this.$options._componentTag === 'FormSelectList') {
        return true;
      }

      // Do not validate if there is no rule
      if (!rules.hasOwnProperty(this.dataFormat)) {
        return true;
      }

      this.dataTypeValidator = new Validator( {[this.name]: value}, {[this.name]: rules[this.dataFormat]}, null);
      return this.dataTypeValidator.passes();
    },
    formatFloatValue() {
      if ( this.dataFormat == 'float' && this.dataTypeValidator.passes() ) {
        this.value = Number(this.value);
        return this.$emit('input', this.value);
      }
    },
    formatValueIfValid(newValue) {
      switch (this.dataFormat) {
        case 'string':
          newValue = newValue.toString();
          break;
        case 'boolean':
          newValue = Boolean(newValue);
          break;
        case 'currency':
        case 'percentage':
          newValue = parseFloat(newValue);
          break;
        case 'int':
          newValue = parseInt(newValue);
          break;
        case 'date':
          if (this.componentName === 'FormDatePicker') {
            newValue = moment.utc(newValue, [getUserDateFormat(), moment.ISO_8601], true).toISOString().split(RegExp('T[0-9]'))[0];
          }
          break;
        case 'datetime':
          if (this.componentName === 'FormDatePicker') {
            newValue = moment(newValue, [getUserDateTimeFormat(), moment.ISO_8601], true).toISOString();
          }
          break;
        case 'array':
          break;
        default:
          newValue = newValue.toString();
          break;
      }
      return newValue;
    },

  },
};
