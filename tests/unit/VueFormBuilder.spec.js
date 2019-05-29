import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueFormBuilder from '@/components/vue-form-builder';
import controlConfig from '@/form-builder-controls';
import Vuex from 'vuex'
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';

i18next.init({
  lng: 'en'
});

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18Next)

const i18n = new VueI18Next(i18next);


function isFormHtmlEditor(config) {
  return config.control.component === 'FormHtmlEditor';
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
});
