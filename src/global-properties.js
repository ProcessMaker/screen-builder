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
    ],
  },
];
