const string = { value: 'string', content: 'Text' };
const int = { value: 'int', content: 'Integer' };
const float = { value: 'float', content: 'Decimal' };
const datetime = { value: 'datetime', content: 'Datetime' };
const date = { value: 'date', content: 'Date' };
const currency = { value: 'currency', content: 'Currency' };
const boolean = { value: 'boolean', content: 'Boolean' };

const allOptions = [string, int, float, datetime, date, currency];
const allOptionsWithoutDate = [string, int, float, currency];

function dataTypeFactory(options) {
  return {
    type: 'FormMultiselect',
    field: 'dataFormat',
    panel: 'variable',
    config: {
      label: 'Data Type',
      name: 'Data Type',
      helper: 'The data type specifies what kind of data is stored in the variable.',
      validation: 'required',
      options,
    },
  };
}

export const DataTypeProperty = dataTypeFactory(allOptions);
export const DataTypeWithoutDateProperty = dataTypeFactory(allOptionsWithoutDate);
export const DataTypeBooleanProperty = dataTypeFactory([boolean]);
export const DataTypeDateTimeProperty = dataTypeFactory([date, datetime]);
