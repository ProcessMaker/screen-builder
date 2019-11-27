import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueFormBuilder from '@/components/vue-form-builder';
import controlConfig from '@/form-builder-controls';
import Vuex from 'vuex';
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';

i18next.init({
  lng: 'en',
});

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18Next);

const i18n = new VueI18Next(i18next);


function isFormHtmlEditor(config) {
  return config.control.component === 'FormHtmlEditor' || config.control.component === 'FormHtmlViewer';
}
function isFormCheckbox(config) {
  return config.control.component === 'FormCheckbox';
}

function isTextArea(config) {
  return config.control.component === 'FormTextArea';
}

describe('App', () => {
  it('Contains Rich Text control', () => {
    const richTextConfig = controlConfig.find(isFormHtmlEditor);
    expect(richTextConfig).toBeDefined();
  });

  it('Can add Rich Text control', () => {
    let store = new Vuex.Store();
    const wrapper = shallowMount(VueFormBuilder, {i18n, store, localVue});
    const richTextConfig = controlConfig.find(isFormHtmlEditor);

    expect(wrapper.vm.controls).toHaveLength(0);

    wrapper.vm.addControl(
      richTextConfig.control,
      richTextConfig.rendererComponent,
      richTextConfig.rendererBinding,
      richTextConfig.builderComponent,
      richTextConfig.builderBinding
    );

    expect(wrapper.vm.controls).toHaveLength(1);
  });

  it('should not contain datatype select on textarea element', function() {
    let store = new Vuex.Store();
    const wrapper = shallowMount(VueFormBuilder, {i18n, store, localVue});
    const checkboxConfig = controlConfig.find(isTextArea);

    wrapper.vm.addControl(
      checkboxConfig.control,
      checkboxConfig.rendererComponent,
      checkboxConfig.rendererBinding,
      checkboxConfig.builderComponent,
      checkboxConfig.builderBinding,
      checkboxConfig.inspector
    );

    checkboxConfig.control.inspector.forEach(item => {
      expect(item.field.dataFormat).toBeUndefined();
    });
  });

  it('should not contain datatype select drop down ', function() {
    let store = new Vuex.Store();
    const wrapper = shallowMount(VueFormBuilder, {i18n, store, localVue});
    const checkboxConfig = controlConfig.find(isFormCheckbox);

    wrapper.vm.addControl(
      checkboxConfig.control,
      checkboxConfig.rendererComponent,
      checkboxConfig.rendererBinding,
      checkboxConfig.builderComponent,
      checkboxConfig.builderBinding,
      checkboxConfig.inspector
    );

    checkboxConfig.control.inspector.forEach(item => {
      expect(item.field.dataFormat).toBeUndefined();
    });
  });
});
