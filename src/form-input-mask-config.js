import currencies from './currency.json';

export default {
  defaultMask: {
    label: 'Data Format',
    options: [],
    config: {},
  },
  currency: {
    label: 'Currency Format',
    options: currencies,
    optionsLabel: 'code',
    config: currencies,
  },
};
