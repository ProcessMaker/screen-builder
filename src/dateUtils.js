/* global ProcessMaker*/
import moment from 'moment-timezone';

moment.tz.setDefault(getTimezone())

const startsWithNumbers = /^\d{4}-/;

function getProcessMakerUserValue(key) {
  if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
    return ProcessMaker.user[key];
  }
}

export function getTimezone() {
  return getProcessMakerUserValue('timezone') || moment.tz.guess();
}

export function getLang() {
  return getProcessMakerUserValue('lang') || 'en';
}

export function getUserDateFormat() {
  if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.datetime_format) {
    return ProcessMaker.user.datetime_format.replace(/[\sHh:msaAzZ]/g, '');
  }

  return 'MM/DD/YYYY';
}

export function getUserDateTimeFormat() {
  return getProcessMakerUserValue('datetime_format') || 'MM/DD/YYYY h:mm A';
}

export function isValidDate(date, format = getUserDateFormat()) {
  return moment(date, format).isValid();
}

export function formatIfDate(string) {
  let d;

  // Quick check for performance before calling moment
  if (!startsWithNumbers.test(string)) {
    return string;
  }

  d = moment(string, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
  if (d.isValid()) {
    return d.format(getUserDateTimeFormat());
  }
  
  d = moment(string, 'YYYY-MM-DD', true);
  if (d.isValid()) {
    return d.format(getUserDateFormat());
  }

  return string;
}
