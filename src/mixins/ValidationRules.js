import { helpers } from 'vuelidate/lib/validators';
import moment from 'moment';
import { get } from 'lodash';

import {
  //required,
  //requiredIf,
  //requiredUnless,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  alpha,
  alphaNum,
  numeric,
  integer,
  decimal,
  email,
  ipAddress,
  macAddress,
  sameAs,
  url,
  not,
  or,
  and,
} from 'vuelidate/lib/validators';

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

export const required = (value) => {
  return value instanceof Array ? value.length > 0 : !!value;
};

export const requiredIf = (variable, expected) => (value, data) => {
  if (get(data, variable) != expected) return true;
  return value instanceof Array ? value.length > 0 : !!value;
};

export const requiredUnless = (variable, expected) => (value, data) => {
  if (get(data, variable) == expected) return true;
  return value instanceof Array ? value.length > 0 : !!value;
};

export const validators = {
  required,
  requiredIf,
  requiredUnless,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  alpha,
  alphaNum,
  numeric,
  integer,
  decimal,
  email,
  ipAddress,
  macAddress,
  sameAs,
  same: sameAs,
  url,
  not,
  or,
  and,
  after,
  beforeOrEqual: before_or_equal,
  max: maxValue,
};
