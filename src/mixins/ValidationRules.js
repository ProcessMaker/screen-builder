import { helpers } from 'vuelidate/lib/validators';
import moment from 'moment';
import { get, isNil } from 'lodash';

import {
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
  //sameAs,
  url,
  not,
  or,
  and,
  maxItems,
  minItems,
  type,
} from 'vuelidate/lib/validators';

export const ValidationMsg = {
  in: 'Invalid value',
  notIn: 'Invalid value',
  accepted: 'Field must be accepted',
  required: 'Field is required',
  requiredIf: 'Field is required',
  requiredUnless: 'Field is required',
  minLength: 'Must have at least {min}',
  maxLength: 'Must have at most {max}',
  min: 'Must have at least {min}',
  max: 'Must have at most {max}',
  minValue: 'Must have a minimum value of {min}',
  maxValue: 'Must have a maximum value of {max}',
  between: 'Must have a value between {min} and {max}',
  alpha: 'Accepts only alphabet characters',
  alphaNum: 'Accepts only alphanumerics',
  numeric: 'Accepts only numerics',
  integer: 'Must be a positive or negative integer',
  decimal: 'Must be a positive or negative decimal number',
  email: 'Must be a valid email address',
  ipAddress: 'Must be a valid IPv4 address',
  macAddress: 'Must be a valid MAC address',
  sameAs: 'Must be same as {field}',
  same: 'Must be same as {field}',
  url: 'Must be a valid URL',
  after: 'Must be after {after}',
  afterOrEqual: 'Must be equal or after {after_or_equal}',
  before: 'Must be before {before}',
  beforeOrEqual: 'Must be equal or before {before_or_equal}',
  invalid_default_value: 'Invalid default value',
  customDate: 'Must be a valid Date',
  regex: 'Invalid value',
  maxItems: 'Should NOT have more than {max} items',
  minItems: 'Must have at least {min}',
  type: 'Invalid type',
};

export const custom_date = (date) => {
  let format = 'MM/DD/YYYY';
  if (typeof window.ProcessMaker !== 'undefined' && window.ProcessMaker.user && window.ProcessMaker.user.datetime_format) {
    format = window.ProcessMaker.user.datetime_format.replace(/[\sHh:msaAzZ]/g, '');
  }

  let checkDate = moment(date, [format, moment.ISO_8601], true);
  return checkDate.isValid();
};
  
export const after = (after, fieldName) => helpers.withParams({after}, function(date, data) {
  // Get check date
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  dataWithParent.today = moment().format('YYYY-MM-DD');
  const checkDate = moment(get(dataWithParent, after, after));
  if (!checkDate.isValid()) {
    return false;
  }

  const inputDate = moment(date).toISOString();
  const afterDate = checkDate.toISOString();

  return inputDate > afterDate;
});

export const after_or_equal = (after_or_equal, fieldName) => helpers.withParams({after_or_equal}, function(date, data) {
  // Get check date
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  dataWithParent.today = moment().format('YYYY-MM-DD');
  const checkDate = moment(get(dataWithParent, after_or_equal, after_or_equal));
  if (!checkDate.isValid()) {
    return false;
  }

  const inputDate = moment(date).toISOString();
  const equalOrAfterDate = checkDate.toISOString();
  return inputDate >= equalOrAfterDate;
});

export const before = (before, fieldName) => helpers.withParams({before}, function(date, data) {
  // Get check date
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  dataWithParent.today = moment().format('YYYY-MM-DD');
  const checkDate = moment(get(dataWithParent, before, before));
  if (!checkDate.isValid()) {
    return false;
  }

  const inputDate = moment(date).toISOString();
  const beforeDate = checkDate.toISOString();
  return inputDate < beforeDate;
});

export const before_or_equal = (before_or_equal, fieldName) => helpers.withParams({before_or_equal}, function(date, data) {
  // Get check date
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  dataWithParent.today = moment().format('YYYY-MM-DD');
  const checkDate = moment(get(dataWithParent, before_or_equal, before_or_equal));
  if (!checkDate.isValid()) {
    return false;
  }
    
  const inputDate = moment(date).toISOString();
  const beforeDate = checkDate.toISOString();
    
  return inputDate <= beforeDate;
});

// The field under validation must be yes, on, or 1. This is useful for validating "Terms of Service" acceptance.
export const accepted = (value) => {
  return value === 'yes' || value === 'on' || value === true || value === 1 || value === '1';
};

// The field under validation must be included in the given list of values.
export const in_list = (list) => helpers.withParams({list}, (value) => {
  list = list instanceof Array ? list : list.split(',');
  return list.findIndex(item => item == value) > -1;
});

// The field under validation must not be included in the given list of values.
export const notIn = (list) => helpers.withParams({list}, (value) => {
  list = list instanceof Array ? list : list.split(',');
  return list.findIndex(item => item == value) === -1;
});

export const regex = (expression) => helpers.withParams({expression}, (value) => {
  const matches = expression.match(/(\/?)(.+)\1([a-z]*)/i);
  const searchPattern = matches[2];
  const flags = matches[3];
  const regexp = new RegExp(searchPattern, flags);
  return !!String(value).match(regexp);
});

export const required = (value) => {
  return value instanceof Array  ? value.length > 0 : !isNil(value) && value !== '' && value !== false;;
};

export const requiredIf = (variable, expected, fieldName) => helpers.withParams({variable, expected}, function(value, data) {
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  const variableValue = get(dataWithParent, variable);
  const isBoolean = (variableValue === true || variableValue === false);
  let expectedValue = expected;
  if (isBoolean) {
    expectedValue = expected === 'true' || expected === '1';
  }
  if (variableValue != expectedValue) return true;
  return value instanceof Array ? value.length > 0 : !!value;
});

export const requiredUnless = (variable, expected, fieldName) => helpers.withParams({variable, expected}, function(value, data) {
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  const variableValue = get(dataWithParent, variable);
  const isBoolean = (variableValue === true || variableValue === false);
  let expectedValue = expected;
  if (isBoolean) {
    expectedValue = expected === 'true' || expected === '1';
  }
  if (variableValue == expectedValue) return true;
  return value instanceof Array ? value.length > 0 : !!value;
});
  
export const sameAs = (field, fieldName) => helpers.withParams({field}, function(value, data) {
  const level = fieldName.split('.').length - 1;
  const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
  const valueSameAs = get(dataWithParent, field);
  return value == valueSameAs;
});

export const validators = {
  required,
  requiredIf,
  requiredUnless,
  minLength,
  maxLength,
  min: minLength,
  max: maxLength,
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
  customDate: custom_date,
  before,
  after,
  beforeOrEqual: before_or_equal,
  accepted,
  in: in_list,
  notIn,
  regex,
  afterOrEqual: after_or_equal,
  maxItems,
  minItems,
  type,
};
