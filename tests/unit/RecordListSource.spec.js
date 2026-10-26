import { mount, shallowMount } from '@vue/test-utils';
import { BTable, BFormSelect } from 'bootstrap-vue';
import RecordList from '@/components/renderer/form-record-list.vue';
import CollectionDataSource from '@/components/inspector/collection-data-source.vue';

jest.mock('@/components/vue-form-renderer.vue', () => ({ render: h => h('div') }));
jest.mock('@/components/inspector/mustache-helper.vue', () => ({}));
jest.mock('@/components/inspector/collection-records-list.vue', () => ({}));
jest.mock('@processmaker/vue-form-elements', () => ({ dateUtils: { formatIfDate: value => value } }));

const source = sourceOptions => ({
  sourceOptions,
  collectionFields: [],
  collectionFieldsColumns: [],
  dataSelectionOptions: 'no-selection',
});

function renderList(style, sourceOptions, editable = true, extraProps = {}) {
  return mount(RecordList, {
    propsData: {
      source: source(sourceOptions),
      editable,
      fields: { jsonData: '[{"value":"name","content":"Name"}]' },
      value: [{ name: 'Saved record' }],
      form: 2,
      formConfig: [{ items: [] }, { items: [] }, { items: [] }],
      validationData: {},
      designerMode: { designerOptions: style },
      ...extraProps,
    },
    parentComponent: { data: () => ({ currentPage: 1 }) },
    mocks: { $t: text => text },
    stubs: {
      'b-table': BTable,
      'b-modal': { template: '<div><slot /></div>' },
      'b-pagination': true,
      'vue-form-renderer': true,
    },
    methods: { onCollectionChange: jest.fn() },
  });
}

function expectEditing(wrapper, enabled) {
  ['add-row', 'edit-row', 'remove-row', 'modal-add', 'modal-edit',
    'modal-remove', 'modal-not-assigned'].forEach(control => {
    expect(wrapper.find(`[data-cy="${control}"]`).exists()).toBe(enabled);
  });
  expect(wrapper.vm.tableFields.some(field => field.key === '__actions')).toBe(enabled);
}

describe.each(['Classic', 'Modern'])('Record List source in %s style', style => {
  describe.each([
    { label: 'missing source', value: undefined },
    { label: 'null source', value: null },
    { label: 'empty source', value: {} },
    { label: 'null source option', value: { sourceOptions: null } },
  ])('legacy configuration with $label', ({ value: legacySource }) => {
    test.each([true, false])('preserves editable set to %p', editable => {
      const wrapper = renderList(style, 'Variable', editable, { source: legacySource });
      expectEditing(wrapper, editable);
      expect(wrapper.text()).toContain('Saved record');
      wrapper.destroy();
    });
  });

  test('previously saved Collection configuration does not expose Variable editing', () => {
    const saved = JSON.parse(JSON.stringify({ source: source('Collection'), editable: true }));
    const wrapper = renderList(style, 'Collection', true, saved);
    expectEditing(wrapper, false);
    expect(wrapper.text()).toContain('Saved record');
    wrapper.destroy();
  });

  test('Variable records remain editable and react to a source change', async () => {
    const wrapper = renderList(style, 'Variable');
    expectEditing(wrapper, true);
    await wrapper.setProps({ source: source('Collection') });
    expectEditing(wrapper, false);
    await wrapper.setProps({ source: source('Variable') });
    expectEditing(wrapper, true);
    wrapper.destroy();
  });

  test.each([false, 'true', 1])('Variable editing requires boolean true, received %p', editable => {
    const wrapper = renderList(style, 'Variable', editable);
    expectEditing(wrapper, false);
    wrapper.destroy();
  });

  test('Collection does not display the Variable self-reference warning', () => {
    const wrapper = renderList(style, 'Collection', true, { form: 1 });
    expect(wrapper.vm.selfReferenced).toBe(true);
    expect(wrapper.find('.alert-danger').exists()).toBe(false);
    wrapper.destroy();
  });

  test('Variable self-reference protection remains active', () => {
    const wrapper = renderList(style, 'Variable', true, { form: 1 });
    expectEditing(wrapper, false);
    expect(wrapper.find('.alert-danger').exists()).toBe(true);
    wrapper.destroy();
  });
});

describe('Record List source inspector', () => {
  test('switching to Collection persists editable false after saving and reopening', async () => {
    const selectedControl = { config: { source: source('Variable'), editable: true, form: 1 } };
    const wrapper = shallowMount(CollectionDataSource, {
      propsData: { value: selectedControl.config.source, selectedControl },
      mocks: { $t: text => text },
      stubs: { 'b-form-select': BFormSelect },
    });
    wrapper.vm.$on('input', value => { selectedControl.config.source = value; });
    await wrapper.find('[data-cy="inspector-collection-data-source"]').setValue('Collection');
    await wrapper.vm.$nextTick();
    const reopened = JSON.parse(JSON.stringify(selectedControl));
    expect(reopened.config.editable).toBe(false);
    expect(reopened.config.source.sourceOptions).toBe('Collection');
    expect(reopened.config.form).toBe(1);

    await wrapper.setData({ sourceOptions: 'Variable' });
    wrapper.vm.displayOptionChange();
    expect(selectedControl.config.editable).toBe(false);
    wrapper.destroy();
  });
});
