import { mount, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import { BTable, BFormSelect, BFormCheckbox, BFormRadio } from 'bootstrap-vue';
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

function renderList(style, sourceOptions, editable = true, extraProps = {}, mountOptions = {}) {
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
      'b-form-checkbox': BFormCheckbox,
      'b-form-radio': BFormRadio,
      'b-modal': { template: '<div><slot /></div>' },
      'b-pagination': true,
      'vue-form-renderer': true,
    },
    methods: { onCollectionChange: jest.fn() },
    ...mountOptions,
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

  test.each([
    { disabled: true },
    { readonly: true },
    { config: { disabled: true } },
    { config: { readonly: true } },
    { config: { editable: false } },
    { _config: { disabled: true } },
    { _config: { readonly: true } },
    { _config: { editable: false } },
  ])('respects editing restrictions %p', restrictions => {
    const wrapper = renderList(style, 'Variable', true, restrictions);
    expectEditing(wrapper, false);
    wrapper.destroy();
  });

  test('reacts to inherited read-only state without losing Variable records', async () => {
    const state = Vue.observable({ value: false });
    const wrapper = renderList(style, 'Variable', true, {}, {
      provide: { formReadOnlyState: state },
    });
    expectEditing(wrapper, true);
    state.value = true;
    await wrapper.vm.$nextTick();
    expectEditing(wrapper, false);
    expect(wrapper.text()).toContain('Saved record');
    state.value = false;
    await wrapper.vm.$nextTick();
    expectEditing(wrapper, true);
    wrapper.destroy();
  });

  test.each(['forceFormReadOnly', 'isFormReadOnly', 'formReadOnlyState'])(
    'respects ancestor %s', flag => {
      const wrapper = renderList(style, 'Variable', true, {}, {
        parentComponent: {
          data: () => ({
            currentPage: 1,
            [flag]: flag === 'formReadOnlyState' ? { value: true } : true,
          }),
        },
      });
      expectEditing(wrapper, false);
      expect(wrapper.vm.canChangeSelection).toBe(false);
      wrapper.destroy();
    },
  );

  test.each(['Collection', 'read-only Variable'])(
    'blocks editing method entry points for %s', mode => {
      const wrapper = renderList(style, mode === 'Collection' ? 'Collection' : 'Variable', true,
        mode === 'Collection' ? {} : { readonly: true });
      const records = JSON.parse(JSON.stringify(wrapper.vm.value));
      wrapper.vm.showAddForm();
      wrapper.vm.showEditForm(0, 'saved');
      wrapper.vm.showDeleteConfirmation(0, 'saved');
      wrapper.vm.togglePopover(0, {}, 'saved');
      wrapper.vm.remove();
      expect(wrapper.vm.addItem).toEqual({});
      expect(wrapper.vm.editItem).toEqual({});
      expect(wrapper.vm.isPopoverVisible).toBeNull();
      expect(wrapper.vm.value).toEqual(records);
      expect(wrapper.emitted('input')).toBeUndefined();
      wrapper.destroy();
    },
  );

  test.each(['single-field', 'single-record', 'multiple-records'])(
    'keeps Collection %s selection independent of editing and locks it reactively', async mode => {
      const state = Vue.observable({ value: false });
      const records = [{ name: 'First' }, { name: 'Second' }];
      const wrapper = renderList(style, 'Collection', true, {
        name: 'selectedRecords',
        fields: { jsonData: '[{"key":"name","label":"Name"}]' },
        source: { ...source('Collection'), dataSelectionOptions: mode, singleField: 'name' },
        value: mode === 'multiple-records' ? [] : null,
      }, { provide: { formReadOnlyState: state } });
      await wrapper.setData({ collectionData: records });
      expectEditing(wrapper, false);
      const controls = () => wrapper.findAllComponents(
        mode === 'multiple-records' ? BFormCheckbox : BFormRadio,
      ).wrappers;
      expect(controls().length).toBeGreaterThan(0);
      expect(controls().every(control => !control.props('disabled'))).toBe(true);
      await wrapper.setProps({ editable: false, disabled: true, readonly: true });
      expect(controls().every(control => !control.props('disabled'))).toBe(true);

      if (mode === 'multiple-records') {
        await wrapper.setData({ selectedRows: [records[1]] });
        wrapper.vm.onMultipleSelectionChange(1);
        expect(wrapper.emitted('input').slice(-1)[0][0]).toEqual([
          { name: 'Second', selectedRowsIndex: 1 },
        ]);
        wrapper.vm.allRowsSelected = true;
        wrapper.vm.selectAllRows();
        expect(wrapper.emitted('input').slice(-1)[0][0]).toEqual([
          { name: 'First', selectedRowsIndex: 0 },
          { name: 'Second', selectedRowsIndex: 1 },
        ]);
      } else {
        await wrapper.setData({ selectedRow: records[1] });
        wrapper.vm.onRadioChange(records[1], 1);
        expect(wrapper.emitted('input').slice(-1)[0][0]).toEqual(
          mode === 'single-field' ? 'Second' : { name: 'Second', selectedRowIndex: 1 },
        );
      }

      state.value = true;
      await wrapper.vm.$nextTick();
      const saved = JSON.parse(JSON.stringify({
        selectedRow: wrapper.vm.selectedRow,
        selectedRows: wrapper.vm.selectedRows,
        collectionData: wrapper.vm.collectionData,
        validationData: wrapper.vm.validationData,
      }));
      const emittedCount = wrapper.emitted('input').length;
      expect(controls().every(control => control.props('disabled'))).toBe(true);
      wrapper.vm.onRadioChange(records[0], 0);
      wrapper.vm.onMultipleSelectionChange(0);
      wrapper.vm.selectAllRows();
      expect(wrapper.emitted('input')).toHaveLength(emittedCount);
      expect({
        selectedRow: wrapper.vm.selectedRow,
        selectedRows: wrapper.vm.selectedRows,
        collectionData: wrapper.vm.collectionData,
        validationData: wrapper.vm.validationData,
      }).toEqual(saved);
      expect(wrapper.text()).toContain('Second');

      state.value = false;
      await wrapper.vm.$nextTick();
      expect(controls().every(control => !control.props('disabled'))).toBe(true);
      wrapper.destroy();
    },
  );
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
