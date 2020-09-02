import { helpers } from 'vuelidate/lib/validators';
import moment from 'moment';

export const ValidationMsg = {
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
  after: 'Must be after {after}',
  after_or_equal: 'Must be equal or after {after_or_equal}',
  before: 'Must be before {before}',
  before_or_equal: 'Must be equal or before {before_or_equal}',
};
  
export const after = (after) => helpers.withParams({after}, (date, data) => {
  // checks if incoming 'params' is a date or a key reference.
  let checkDate = moment(after);
  if (!checkDate.isValid()) {
    after = data[after];
  }

  const inputDate = moment(date).toISOString();
  const afterDate = moment(after).toISOString();

  return inputDate > afterDate;
});

export const after_or_equal = (after_or_equal) => (date, data) => {
  // checks if incoming 'after_or_equal' is a date or a key reference.
  let checkDate = moment(after_or_equal);
  if (!checkDate.isValid()) {
    after_or_equal = data[after_or_equal];
  }

  const inputDate = moment(date).toISOString();
  const equalOrAfterDate = moment(after_or_equal).toISOString();
    
  return inputDate >= equalOrAfterDate;
};

export const before = (before) => (date, data) => {
  // checks if incoming 'before' is a date or a key reference.
  let checkDate = moment(before);
  if (!checkDate.isValid()) {
    before = data[before];
  }

  const inputDate = moment(date).toISOString();
  const beforeDate = moment(before).toISOString();
    
  return inputDate < beforeDate;
};

export const before_or_equal = (before_or_equal) => (date, data) => {
  // checks if incoming 'before_or_equal' is a date or a key reference.
  let checkDate = moment(before_or_equal);
  if (!checkDate.isValid()) {
    before_or_equal = data[before_or_equal];
  }
    
  const inputDate = moment(date).toISOString();
  const beforeDate = moment(before_or_equal).toISOString();
    
  return inputDate <= beforeDate;
};

/*export const required_if = (params) => (val, req, attribute) => {
    if (typeof req === 'string') {
        req = req.split(',');
    }
    
    let inputtedValue = this.validator._objectPath(this.validator.input, req[0]);

    switch (typeof inputtedValue) {
        case 'boolean':
        case 'number':
            if (inputtedValue.toString() == req[1]) {
                return this.validator.getRule('required').validate(val);
            }
            break;
        default:
            if (inputtedValue == req[1]) {
                return this.validator.getRule('required').validate(val);
            }
            break;
    }
    return true;
}, 'The :attribute field is required.');*/

/*export const required_unless = (params) => (val, req, attribute) => {
    if (typeof req === 'string') {
        req = req.split(',');
    }
    
    let inputtedValue = this.validator._objectPath(this.validator.input, req[0]);

    switch (typeof inputtedValue) {
        case 'boolean':
        case 'number':
            if (inputtedValue.toString() !== req[1]) {
                return this.validator.getRule('required').validate(val);
            }
            break;
        default:
            if (inputtedValue !== req[1]) {
                return this.validator.getRule('required').validate(val);
            }
            break;
    }
    return true;
}, 'The :attribute field is required.');*/
