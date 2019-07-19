export const dataSources = [
  { value: 'provideData', text: 'Provide Data' },
  { value: 'dataObject', text: 'Data Object' },
];

export const dataSourceValues = dataSources.reduce((values, source) => {
  values[source.value] = source.value;
  return values;
}, {});
