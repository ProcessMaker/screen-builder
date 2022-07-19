const Validator = require('validatorjs');
import { formatISO, parseISO, format as formatDateFns } from 'date-fns';

Validator.register('custom-same', function(val, req) {
  let val1;
  let val2 = val;
  if (!req.includes('.')) {
    val1 = this.validator._flattenObject(this.validator.input)[req];
  } else {
    val1 = req.split('.').reduce((obj,i)=>obj[i], this.validator.input);
  }
  
  if (val1 === val2) {
    return true;
  }
  
  return false;
}, 'The :attribute and :custom-same fields must match.');
  
Validator.register('after', function(date, params) {
  // checks if incoming 'params' is a date or a key reference.
  const inputDate = formatISO(date);
  const afterDate = formatISO(params);

  return inputDate > afterDate;
}, 'The :attribute must be after :after.');

Validator.register('after_or_equal', function(date, params) {
  // checks if incoming 'params' is a date or a key reference.
  const inputDate = formatISO(date);
  const equalOrAfterDate = formatISO(params);
    
  return inputDate >= equalOrAfterDate;
}, 'The :attribute must be equal or after :after_or_equal.');

Validator.register('before', function(date, params) {
  // checks if incoming 'params' is a date or a key reference.
  const inputDate = formatISO(date);
  const beforeDate = formatISO(params);
    
  return inputDate < beforeDate;
}, 'The :attribute must be before :before.');

Validator.register('before_or_equal', function(date, params) {
  // checks if incoming 'params' is a date or a key reference.
  const inputDate = formatISO(date);
  const beforeDate = formatISO(params);
    
  return inputDate <= beforeDate;
}, 'The :attribute must be equal or before :before_or_equal.');

Validator.register('custom_date', function(date) {
  let format = 'MM/dd/yyyy';
  if (typeof window.ProcessMaker !== 'undefined' && window.ProcessMaker.user && window.ProcessMaker.user.datetime_format) {
    format = window.ProcessMaker.user.datetime_format.replace(/[\sHh:msaAzZ]/g, '');
  }

  let checkDate = formatDateFns(parseISO(date), format);
  return checkDate.isValid();
}, 'The :attribute must be a valid date.');