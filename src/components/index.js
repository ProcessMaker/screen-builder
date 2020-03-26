// Import our components
import VueFormBuilder from './vue-form-builder';
import VueFormRenderer from './vue-form-renderer';
import * as editor from './editor';
import * as renderer from './renderer';
import FormMultiColumn from './renderer/form-multi-column';
import * as inspector from './inspector';
import FormBuilderControls from '../form-builder-controls';
import Vocabularies from './vocabularies';

const rendererComponents = {
  ...renderer,
  FormMultiColumn,
};

// Export our named exports
export {
  VueFormBuilder,
  VueFormRenderer,
  editor,
  inspector,
  rendererComponents as renderer,
  FormBuilderControls,
  Vocabularies,
};

// Export our Vue plugin as our default
export default {
  install(Vue) {
    // First check to see if we're already installed
    if (Vue._processMakerVueFormBuilderInstalled) {
      return;
    }

    // Boolean flag to see if we're already installed
    Vue._processMakerVueFormBuilderInstalled = true;

    // Register the builder and renderer
    Vue.component('vue-form-builder', VueFormBuilder);
    Vue.component('vue-form-renderer', VueFormRenderer);
  },
};
