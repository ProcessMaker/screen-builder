export const bgcolorProperty = {
  type: 'ColorSelect',
  field: 'bgcolor',
  config: {
    label: 'Background Color',
    helper: 'Set the element\'s background color',
    options: [
      {
        value: 'alert alert-primary',
        content: 'primary',
      },
      {
        value: 'alert alert-secondary',
        content: 'secondary',
      },
      {
        value: 'alert alert-success',
        content: 'success',
      },
      {
        value: 'alert alert-danger',
        content: 'danger',
      },
      {
        value: 'alert alert-warning',
        content: 'warning',
      },
      {
        value: 'alert alert-info',
        content: 'info',
      },
      {
        value: 'alert alert-light',
        content: 'light',
      },
      {
        value: 'alert alert-dark',
        content: 'dark',
      },
    ],
  },
};

export const colorProperty = {
  type: 'ColorSelect',
  field: 'color',
  config: {
    label: 'Text Color',
    helper: 'Set the element\'s text color',
    options: [
      {
        value: 'text-primary',
        content: 'primary',
      },
      {
        value: 'text-secondary',
        content: 'secondary',
      },
      {
        value: 'text-success',
        content: 'success',
      },
      {
        value: 'text-danger',
        content: 'danger',
      },
      {
        value: 'text-warning',
        content: 'warning',
      },
      {
        value: 'text-info',
        content: 'info',
      },
      {
        value: 'text-light',
        content: 'light',
      },
      {
        value: 'text-dark',
        content: 'dark',
      },
    ],
  },
};

export const keyNameProperty = {
  type: 'FormInput',
  field: 'name',
  config: {
    label: 'Variable Name',
    name: 'Variable Name',
    validation: 'regex:/^(?:[A-Z_.a-z])(?:[0-9A-Z_.a-z])*$/|required',
    helper: 'A variable name is a symbolic name to reference information.',
  },
};

export const labelProperty = {
  type: 'FormInput',
  field: 'label',
  config: {
    label: 'Label',
    helper: 'The label describes the field\'s name',
  },
};

export const buttonLabelProperty = {
  ...labelProperty,
  config: {
    label: 'Button Label',
    helper: 'The label describes the button\'s text',
  },
};

export const placeholderProperty = {
  type: 'FormInput',
  field: 'placeholder',
  config: {
    label: 'Placeholder Text',
    helper: 'The placeholder is what is shown in the field when no value is provided yet',
  },
};

export const helperTextProperty = {
  type: 'FormInput',
  field: 'helper',
  config: {
    label: 'Helper Text',
    helper: 'Help text is meant to provide additional guidance on the field\'s value',
  },
};

export const readonlyProperty = {
  type: 'FormCheckbox',
  field: 'readonly',
  config: {
    label: 'Read Only',
  },
};

export const disabledProperty = {
  type: 'FormCheckbox',
  field: 'disabled',
  config: {
    label: 'Read Only',
  },
};

export const validationRulesProperty = {
  type: 'ValidationSelect',
  field: 'validation',
  value: [],
  config: {
    label: 'Validation Rules',
    helper: 'The validation rules needed for this field',
    options: [
      {
        value: 'accepted',
        content: 'Accepted',
        helper: 'The field under validation must be yes, on, 1 or true.',
        configs: [],
      },
      // {
      //   value: 'after:',
      //   content: 'After Date',
      //   helper: '',
      //   configs: [
      //     {type: 'FormInput', field: 'date', label: 'Date', value:'', helper: 'The field under validation must be after the given date.'},
      //   ],
      // },
      // {
      //   value: 'after_or_equal:',
      //   content: 'After or Equal Date',
      //   helper: 'The field unter validation must be after or equal to the given field.',
      //   configs: [],
      // },
      {
        value: 'alpha',
        content: 'Alpha',
        helper: 'The field under validation must be entirely alphabetic characters.',
        configs: [],
      },
      // {
      //   value: 'before:',
      //   content: 'Before Date',
      //   helper: 'The field under validation must be before the given date.',
      //   configs: [],
      // },
      // {
      //   value: 'before_or_equal:',
      //   content: 'Before or Equal Date',
      //   helper: 'The field under validation must be before or equal to the given date.',
      //   configs: [],
      // },
      // {
      //   value: 'between:',
      //   content: 'Between Min & Max',
      //   helper: 'The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in the same fashion as the size rule.',
      //   configs: [],
      // },
      // {
      //   value: 'confirmed:',
      //   content: 'Confirmed',
      //   helper: 'The field under validation must have a matching field of another field.',
      //   configs: [],
      // },
      {
        value: 'email',
        content: 'Email',
        helper: 'The field under validation must be formatted as an e-mail address.',
        configs: [],
      },
      // {
      //   value: 'in:',
      //   content: 'In',
      //   helper: 'The field under validation must be included in the given list of values. The field can be an array or string.',
      //   configs: [],
      // },
      // {
      //   value: 'max:',
      //   content: 'Max Value',
      //   helper: 'Validate that an attribute is no greater than a given size.',
      //   configs: [],
      // },
      // {
      //   value: 'min:',
      //   content: 'Min Value',
      //   helper: 'Validate that an attribute is at least a given size.',
      //   configs: [],
      // },
      // {
      //   value: 'not_in:',
      //   content: 'Not In',
      //   helper: 'The field under validation must not be included in the given list of values.',
      //   configs: [],
      // },
      {
        value: 'required',
        content: 'Required',
        helper: 'Checks if the length of the String representation of the value is >',
        configs: [],
      },
      {
        value: 'url',
        content: 'URL',
        helper: 'Validate that an attribute has a valid URL format',
        configs: [],
      },
      {
        value: 'same:',
        content: 'Same',
        helper: 'The given field must match the field under validation.',
        configs: [
          {type: 'FormInput', label: 'Variable Name', value:'', helper: '', validation: 'required'},
        ],
      },

      // {
      //   value: 'email',
      //   text: 'Email',
      //   configs: [],
      // },
      // {
      //   value: 'equality',
      //   text: 'Equality',
      //   configs: [
      //     {type: 'FormInput', field: 'variableName', label: 'Variable Name', value:'', helper: 'Specify which variable to verify.'},
      //   ],
      // },
      // {
      //   value: 'exclusion',
      //   text: 'Exclusion',
      //   configs: [],
      // },
      // {
      //   value: 'format',
      //   text: 'Format',
      //   configs: [],
      // },
      // {
      //   value: 'inclusion',
      //   text: 'Inclusion',
      //   configs: [
      //     {type: 'FormInput', field: 'is', label: 'Is', value:[], helper: 'The value has to have exactly this length.'},
      //   ],
      // },
      // {
      //   value: 'length',
      //   text: 'Length',
      //   configs: [
      //     {type: 'FormInput', field: 'is', label: 'Is', value:'', helper: 'The value has to have exactly this length.'},
      //     {type: 'FormInput', field: 'minimum', label: 'Minimum', value:'', helper: 'The value cannot be shorter than this value.'},
      //     {type: 'FormInput', field: 'maximum', label: 'Maximum', value:'', helper: 'The value cannot be longer than this value.'},
      //   ],
      // },
      // {
      //   value: 'url',
      //   text: 'URL',
      //   configs: [
      //     {type: 'FormInput', field: 'schemes', label: 'Schemes', value:[], helper: 'A list of schemes to allow. If you want to support any scheme you can use a regexp here (for example [".+"]). The default value is ["http", "https"].'},
      //     {type: 'FormCheckBox', field: 'allowLocal', label: 'Allow Local Host', value: false, helper: 'Allows local hostnames such as 10.0.1.1 or localhost'},
      //     {type: 'FormCheckBox', field: 'allowDataUrl', label: 'Allow Data URL', value: false, helper: 'Allows data URLs as defined in RFC 2397'},
      //   ],
      // },
      // {
      //   value: 'required',
      //   text: 'Required',
      //   configs: [],
      // },
    ],
  },
};

export const toggleStyleProperty = {
  type: 'FormCheckbox',
  field: 'toggle',
  config: {
    label: 'Toggle Style',
    helper: '',
  },
};

export const buttonVariantStyleProperty = {
  type: 'FormMultiselect',
  field: 'variant',
  config: {
    label: 'Button Variant Style',
    helper: 'The variant determines the appearance of the button',
    options: [
      {
        value: 'primary',
        content: 'Primary',
      },
      {
        value: 'secondary',
        content: 'Secondary',
      },
      {
        value: 'success',
        content: 'Success',
      },
      {
        value: 'danger',
        content: 'Danger',
      },
      {
        value: 'warning',
        content: 'Warning',
      },
      {
        value: 'info',
        content: 'Info',
      },
      {
        value: 'light',
        content: 'Light',
      },

      {
        value: 'dark',
        content: 'Dark',
      },

      {
        value: 'link',
        content: 'Link',
      },
    ],
  },
};
