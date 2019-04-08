import { shallowMount } from '@vue/test-utils';
import VueFormBuilder from '@/components/vue-form-builder';
import controlConfig from '@/form-builder-controls';

function isFormHtmlEditor(config) {
  return config.control.component === 'FormHtmlEditor';
}

describe('App', () => {
  it('Contains Rich Text control', () => {
    const richTextConfig = controlConfig.find(isFormHtmlEditor);
    expect(richTextConfig).toBeDefined();
  });

  it('Can add Rich Text control', () => {
    const wrapper = shallowMount(VueFormBuilder);
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
