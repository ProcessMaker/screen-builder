import { get } from 'lodash';
import Mustache from 'mustache';

const ValidationMsg = {
  required: 'Field is required',
  requiredIf: 'Field is required',
  requiredUnless: 'Field is required',
  minLength: 'Must have at least {min}',
  maxLength: 'Must have at most {max}',
  minValue: 'Must have a minimum value of {min}',
  maxValue: 'Must have a maximum value of {max}',
  between: 'Must have a value between {min} and {max}',
  alpha: 'Accepts only alphabet characters',
  alphaNum: 'Accepts only alphanumerics',
  numeric: 'Accepts only numerics',
  integer: 'Must be a positive or negative integer',
  decimal: 'Must be a positive or negative decimal number',
  email: 'Must be a valid email addresses',
  ipAddress: 'Must be a valid IPv4 addresses',
  macAddress: 'Must be a valid MAC addresses',
  sameAs: 'Must be same as %',
  same: 'Must be same as %',
  url: 'Must be a valid URL',
};

export default {
  props: {
    vdata: {
      type: Object,
      required: true,
    },
  },
  computed: {
    references__() {
      return this.$parent && this.$parent.references__;
    },
  },
  methods: {
    mustache(text) {
      try {
        return Mustache.render(text, this.vdata);
      } catch (e) {
        return e.message;
      }
    },
    submitForm() {
      this.$emit('submit', this.vdata);
    },
    getValue(name, object = this) {
      return object ? get(object, name) : undefined;
    },
    setValue(name, value, object = this, defaults = object) {
      if (object && value !== undefined) {
        const splittedName = name.split('.');
        splittedName.forEach((attr, index) => {
          this.$set(
            object,
            attr,
            index < splittedName.length - 1 ? get(object, attr) || get(defaults, attr) || {} : value
          );
          object = get(object, attr);
        });
      }
    },
    validationMessage(validation) {
      const message = [];
      Object.keys(ValidationMsg).forEach(key => {
        if (validation[key]!==undefined && !validation[key]) {
          message.push(this.$t(ValidationMsg[key]).replace(/\{(.+?)\}/g,(match,p1)=>{return validation.$params[key][p1];}));
        }
      });
      return message.join('.\n');
    },
  },
};
