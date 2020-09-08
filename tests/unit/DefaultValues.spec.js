import { createLocalVue, mount } from '@vue/test-utils';
// import App from '../../src/App';
import BootstrapVue from 'bootstrap-vue';
// import Renderer from '../../src/components/vue-form-renderer';
import ViewFormRendererWrapper from './fixtures/VueFormRendererWrapper';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

jest.mock('vue-monaco');
jest.mock('monaco-editor/esm/vs/editor/editor.main', () => {});
jest.mock('scrollparent');

// Move to factory
const wrapperFactory = () => {
  return mount(ViewFormRendererWrapper, {
    localVue,
    mocks: {
      $t: text => text,
    },
    // sync: false,
    propsData: {
      config: [{
        items: [],
      }],
      data: {},
      page: 0,
    },
  });
};

it('does not overwrite existing data, including if its empty or null', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
  });
  await wrapper.vm.$nextTick();
  wrapper.setData({
    previewData: { input2: 'abc', input3: '', input1: null },
  });
  await wrapper.vm.$nextTick();
  
  const result = wrapper.vm.previewData;
  expect(result.input2).toBe('abc');
  expect(result.input3).toBe('');
  expect(result.input1).toBe(null);
});

it('sets data that does not exist', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
    previewData: { init: 1 },
  });

  // Because it's emitting
  await wrapper.vm.$nextTick();

  const result = wrapper.vm.previewData;
  expect(result.input2).toBe('foo');
  expect(result.input3).toBe('input2: foo');
  expect(result.input1).toBe('input3: input2: foo');
});

it('updates when a referenced field changes', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
    previewData: { init: 1 },
  });
  await wrapper.vm.$nextTick();
  
  expect(wrapper.vm.previewData.input2).toBe('foo');
  
  wrapper.find('[name="input2"]').setValue('bar');
  await wrapper.vm.$nextTick();
  
  expect(wrapper.vm.previewData.input2).toBe('bar');
  expect(wrapper.vm.previewData.input3).toBe('input2: bar');
  expect(wrapper.vm.previewData.input1).toBe('input3: input2: bar');
});

it('does not update a field once the field has been edited', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
    previewData: { init: 1 },
  });
  await wrapper.vm.$nextTick();
  
  expect(wrapper.vm.previewData.input2).toBe('foo');
  expect(wrapper.vm.previewData.input3).toBe('input2: foo');
  expect(wrapper.vm.previewData.input1).toBe('input3: input2: foo');

  wrapper.find('[name="input3"]').setValue('changed');
  await wrapper.vm.$nextTick();
  wrapper.find('[name="input2"]').setValue('bar');
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.previewData.input3).toBe('changed');
  expect(wrapper.vm.previewData.input1).toBe('input3: changed');

});

it.skip('test with always-changing default value, like js Date object', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
    previewData: { init: 1 },
  });
  await wrapper.vm.$nextTick();
  
  const setDefault = (new Date()).toISOString();
  let match = setDefault.substr(0, 17) + '00.000Z';
  expect(wrapper.vm.previewData.datepicker).toBe(match);
 
  const setTo = (new Date('01 Jan 2020 00:00:00 GMT')).toISOString();
  wrapper.find('[name="current_iso_date"]').setValue(setTo);

  await wrapper.vm.$nextTick();
  match = setTo.substr(0, 17) + '00.000Z';
  expect(wrapper.vm.previewData.datepicker).toBe(match);
});

it('works in loops', async() => {
  const wrapper = wrapperFactory();
  wrapper.setData({
    config: require('./fixtures/defaults.json'),
    previewData: { init: 1 },
  });
  await wrapper.vm.$nextTick();
  
  expect(wrapper.vm.previewData.loop[0].input1).toBe('foo');
  expect(wrapper.vm.previewData.loop[0].input2).toBe('loop input1: foo');
});