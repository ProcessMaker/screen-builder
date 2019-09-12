import currencies from './currency.json';

const currencyCodes = [];
for (let code in currencies) {
  currencyCodes.push(code);
}
export default {
  defaultMask: {
    label: 'Data Format',
    options: [],
    config: {},
  },
  currency: {
    label: 'Currency Format',
    options: currencyCodes,
    config: currencies,
  },
};
