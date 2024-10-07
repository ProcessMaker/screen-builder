import Tooltip from './components/inspector/tooltip';
import DeviceVisibility from './components/inspector/device-visibility';

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

// Ref https://mathiasbynens.be/notes/javascript-identifiers
export const javascriptReservedKeywords = 'null,break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,class,const,enum,export,extends,import,super,true,false';

export const keyNameProperty = {
  type: 'FormInput',
  field: 'name',
  config: {
    label: 'Variable Name',
    name: 'Variable Name',
    // Update tests/e2e/specs/Builder.spec.js when changing dot_notation
    validation: 'dot_notation|required|not_in:' + javascriptReservedKeywords,
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
  config: {
    label: 'Validation Rules',
    helper: 'The validation rules needed for this field',
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

export const defaultValueProperty = {
  type: "default-value-editor",
  field: 'defaultValue',
  config: {
    label: 'Default Value',
    helper: 'The default value is pre populated using the existing request data. This feature will allow you to modify the value displayed on screen load if needed.',
  },
};

export const buttonTypeEvent = {
  type: 'FormMultiselect',
  field: 'event',
  config: {
    label: 'Type',
    helper: 'Choose whether the button should submit the form',
    options: [
      {
        value: 'submit',
        content: 'Submit Button',
      },
      {
        value: 'script',
        content: 'Regular Button',
      },
    ],
  },
};

export const tooltipProperty = {
  type: Tooltip,
  field: 'tooltip',
  config: {
    label: 'Tooltip ',
  },
};

export const deviceVisibilityProperty = {
  type: DeviceVisibility,
  field: 'deviceVisibility',
  config: {
    label: 'Device Visibility ',
  },
};

export const LoadingSubmitButtonProperty = {
  type: 'LoadingSubmitButton',
  field: 'loading',
  config: {
    label: 'Loading Submit Button',
    helper: 'Loading Submit Button',
  },
};

export const LabelSubmitButtonProperty = {
  type: 'LabelSubmitButton',
  field: 'loadingLabel',
  config: {
    label: 'Loading Submit Button Label',
    helper: 'Loading Submit Button Label',
  },
};
