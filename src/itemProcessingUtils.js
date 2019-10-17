function removeInvalidOptions(option) {
  return Object.keys(option).includes('value') &&
    option.content != null;
}

function getOptionsFromDataSource(inputOptions, data) {
  const {jsonData, key, value, dataName} = inputOptions;

  const convertToSelectOptions = option => ({
    value: option[key || 'value'],
    content: option[value || 'content'],
  });

  try {
    if (jsonData) {
      return JSON.parse(jsonData)
        .map(convertToSelectOptions)
        .filter(removeInvalidOptions);
    }

    return data[dataName]
      .map(convertToSelectOptions)
      .filter(removeInvalidOptions);
  } catch (error) {
    return [];
  }
}

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

export function getDefaultValueForItem(item, transientData) {
  let defaultValue = null;

  if (['FormInput', 'FormTextArea', 'FormText'].includes(item.component)) {
    defaultValue = '';
  }

  if (['FormSelect', 'FormRadioButtonGroup'].includes(item.component) && item.config.options) {
    const options = getOptionsFromDataSource(item.config.options, transientData);

    defaultValue = options[0] ? options[0].value : null;
  }

  if (item.component === 'FormCheckbox') {
    defaultValue = item.config.initiallyChecked || false;
  }

  if (item.component === 'FormRecordList') {
    defaultValue = [];
  }

  if (item.component === 'FormDatePicker') {
    const date = new Date();
    defaultValue = date.toISOString();
  }
  return defaultValue;
}
