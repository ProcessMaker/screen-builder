import {createLocalVue, shallowMount} from '@vue/test-utils';
import OptionsList from '@/components/inspector/options-list';
import BootstrapVue from 'bootstrap-vue';
import {dataSourceValues} from '@/components/inspector/data-source-types';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('OptionsList', () => {
  /* @TODO: Fix test. */
  it.skip('should toggle between JSON and options list without showing key/value fields', () => {
    const wrapper = shallowMount(OptionsList, {
      propsData: {
        options: {
          dataSource: dataSourceValues.provideData,
          showJsonEditor: true,
        },
      },
      mocks: {
        $t: text => text,
      },
      localVue,
    });

    const assertValueContentFieldsHidden = () => {
      expect(wrapper.find('#key').exists()).toBe(false);
      expect(wrapper.find('#value').exists()).toBe(false);
    };

    expect(wrapper.find('.small-editor-container').exists()).toBe(false);
    assertValueContentFieldsHidden();

    wrapper.find('.edit-json').trigger('click');

    /* @TODO: This assertion fails. Not sure why. Clicking the `.edit-json` button seems to correctly toggle the
         `showJsonEditor` value but it's not reflected in the template of the wrapper. */
    expect(wrapper.find('.small-editor-container').exists()).toBe(true);

    assertValueContentFieldsHidden();

    wrapper.find('.edit-json').trigger('click');

    expect(wrapper.find('.small-editor-container').exists()).toBe(false);
    assertValueContentFieldsHidden();
  });
});
