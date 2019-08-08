export default [
  {
    name: 'Variable',
    fields: [
      { name: 'name', hideFor: 'FormImage' },
      'fieldValue',
      'dataFormat',
      'validation',
      'readonly',
      'initiallyChecked',
    ],
    open: true,
  },
  {
    name: 'Configuration',
    fields: [
      { name: 'name', showFor: 'FormImage' },
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
      { name: 'options', showFor: 'FormMultiColumn' },
      'form',
    ],
    open: true,
  },
  {
    name: 'Data Source',
    fields: [
      'fields',
      { name: 'options', hideFor: 'FormMultiColumn' },
    ],
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
