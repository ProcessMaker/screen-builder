/* istanbul ignore file */
import moment from 'moment-timezone';

function processFormItem(item) {
  if (item.component !== 'FormMultiColumn') {
    return item;
  }

  return item.items.flatMap(processFormItem);
}

export function getItemsFromConfig(config) {
  return config
    .flatMap(page => page.items)
    .flatMap(processFormItem);
}

export function getDefaultValueForItem(item) {
  let defaultValue = null;

  if (['FormInput', 'FormTextArea', 'FormText'].includes(item.component)) {
    defaultValue = '';
  }

  if (item.component === 'FormCheckbox') {
    defaultValue = item.config.initiallyChecked || false;
  }

  if (item.component === 'FormRecordList') {
    defaultValue = [];
  }

  if (item.component === 'FormDatePicker') {
    defaultValue = generateNewDate(item.config.dataFormat);
  }

  if (item.component === 'FormButton' && item.config.event === 'script') {
    defaultValue = 0;
  }

  return defaultValue;
}

function generateNewDate(dataFormat) {
  let timezone = moment.tz.guess();

  if (typeof window.ProcessMaker !== 'undefined' && window.ProcessMaker.user && window.ProcessMaker.user.timezone) {
    timezone = window.ProcessMaker.user.timezone;
  }

  const date = moment.tz(timezone);

  if (dataFormat !== 'datetime') {
    date.startOf('day');
  }

  return date.toISOString();
}
