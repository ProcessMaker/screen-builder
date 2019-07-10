export const DataTypeProperty = {
  type: 'FormMultiselect',
  field: 'dataFormat',
  panel: 'variable',
  config: {
    label: 'Data Type',
    name: 'Data Type',
    helper: 'The data type specifies what kind of data is stored in the variable.',
    validation: 'required',
    options: [
      {
        value: 'string',
        content: 'Text',
      },
      {
        value: 'int',
        content: 'Integer',
      },
      {
        value: 'float',
        content: 'Decimal',
      },
      {
        value: 'datetime',
        content: 'Datetime',
      },
      {
        value: 'date',
        content: 'Date',
      },
      {
        value: 'currency',
        content: 'Currency',
      },
    ],
  },
};
export const DataTypeWithoutDateProperty = {
  type: 'FormMultiselect',
  field: 'dataFormat',
  panel: 'variable',
  config: {
    label: 'Data Type',
    name: 'Data Type',
    helper: 'The data type specifies what kind of data is stored in the variable.',
    validation: 'required',
    options: [
      {
        value: 'string',
        content: 'Text',
      },
      {
        value: 'int',
        content: 'Integer',
      },
      {
        value: 'float',
        content: 'Decimal',
      },
      {
        value: 'currency',
        content: 'Currency',
      },
    ],
  },
};
export const DataTypeBooleanProperty = {
  type: 'FormMultiselect',
  field: 'dataFormat',
  panel: 'variable',
  config: {
    label: 'Data Type',
    name: 'Data Type',
    helper: 'The data type specifies what kind of data is stored in the variable.',
    validation: 'required',
    options: [
      {
        value: 'boolean',
        content: 'Boolean',
      },
    ],
  },
};
export const DataTypeDateTimeProperty = {
  type: 'FormMultiselect',
  field: 'type',
  panel: 'variable',
  config: {
    label: 'Data Type',
    name: 'Data Type',
    helper: 'The data type specifies what kind of data is stored in the variable.',
    validation: 'required',
    options: [
      {
        value: 'datetime',
        content: 'Datetime',
      },
      {
        value: 'date',
        content: 'Date',
      },
    ],
  },
};
