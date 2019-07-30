export default [
  {
    name: 'Variable',
    fields: ['name', 'fieldValue', 'dataFormat', 'validation', 'readonly', 'initiallyChecked'],
    open: true,
  },
  {
    name: 'Configuration',
    fields: [
      'image',
      'eventData',
      'label',
      'type',
      'placeholder',
      'content',
      'helper',
      'Multiselect checkbox (doesn’t exist)',
      'richtext',
      'rows',
    ],
    open: true,
  },
  {
    name: 'Data Source',
    fields: ['options'],
    open: true,
  },
  {
    name: 'Design',
    fields: ['color', 'bgcolor', 'variant', 'toggle', 'height', 'width'],
    open: true,
  },
  {
    name: 'Advanced',
    fields: ['conditionalHide', 'selector'],
    open: true,
  },
];
