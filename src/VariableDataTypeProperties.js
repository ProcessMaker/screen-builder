const string = { value: 'string', content: 'Text' };
const int = { value: 'int', content: 'Integer' };
const currency = { value: 'currency', content: 'Currency' };
const float = { value: 'float', content: 'Decimal' };
const datetime = { value: 'datetime', content: 'Datetime' };
const date = { value: 'date', content: 'Date' };
const boolean = { value: 'boolean', content: 'Boolean' };

const allOptions = [string, int, currency, float, datetime, date];
const allOptionsWithoutDate = [string, int, float];

function dataTypeFactory(options) {
  return {
    type: 'FormMultiselect',
    field: 'dataFormat',
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
