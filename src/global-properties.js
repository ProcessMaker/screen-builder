export const formTypes = {
  form: 'form',
  display: 'display',
};

export default [
  {
    inspector: [
      {
        type: 'FormInput',
        field: 'conditionalHide',
        config: {
          label: 'Visibility Rule',
          helper: 'This control is hidden until this expression is true',
        },
      },
      {
        type: 'DeviceVisibility',
        field: 'deviceVisibility',
        config: {
          label: 'Device Visibility',
          helper: 'This control is hidden until this expression is true',
        },
      },
      {
        type: 'FormInput',
        field: 'customFormatter',
        config: {
          label: 'Custom Format String',
          helper: 'Use the Mask Pattern format <br> Date ##/##/#### <br> SSN ###-##-#### <br> Phone (###) ###-####',
          validation: '',
        },
      },
      {
        type: 'FormInput',
        field: 'customCssSelector',
        config: {
          label: 'CSS Selector Name',
          helper: 'Use this in your custom css rules',
          validation: 'regex: [-?[_a-zA-Z]+[_-a-zA-Z0-9]*]',
        },
      },
      {
        type: 'FormInput',
        field: 'ariaLabel',
        config: {
          label: 'Aria Label',
          helper: 'Attribute designed to help assistive technology (e.g. screen readers) attach a label',
        },
      },
      {
        type: 'FormInput',
        field: 'tabindex',
        config: {
          label: 'Tab Order',
          helper: 'Order in which a user will move focus from one control to another by pressing the Tab key',
          validation: 'regex: [0-9]*',
        },
      },
      {
        type: 'EncryptedConfig',
        field: 'encryptedConfig',
        config: {
          label: 'Encrypted',
          helper: '',
        },
      },
    ],
  },
];
