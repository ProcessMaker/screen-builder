// Import our components
import VueFormBuilder from './components/vue-form-builder';
import VueFormRenderer from './components/vue-form-renderer';
import * as renderer from './components/renderer';
import FormMultiColumn from './components/renderer/form-multi-column';
import * as inspector from './components/inspector';
import FormBuilderControls from './form-builder-controls';
import Task from './components/task';
import Loop from './components/editor/loop';
import MultiColumn from './components/editor/multi-column';
import FormLoop from './components/renderer/form-loop';
import NewFormMultiColumn from './components/renderer/new-form-multi-column';
import FormNestedScreen from './components/renderer/form-nested-screen';
import ScreenRenderer from './components/screen-renderer';
import AddLoopRow from './components/renderer/add-loop-row';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';
import FormButton from './components/renderer/form-button';
import FileUpload from './components/renderer/file-upload.vue';
import FileDownload from './components/renderer/file-download.vue';
import FormMaskedInput from './components/renderer/form-masked-input';
import DefaultLoadingSpinner from './components/utils/default-loading-spinner';
import DataProvider from './DataProvider';
import { cacheAdapterEnhancer } from "axios-extensions";
import LRUCache from "lru-cache";
import Vuex from "vuex";
import globalErrorsModule from "@/store/modules/globalErrorsModule";
import undoRedoModule from "@/store/modules/undoRedoModule";

const rendererComponents = {
  ...renderer,
  FormMultiColumn,
};

// Export our named exports
export {
  VueFormBuilder,
  VueFormRenderer,
  inspector,
  rendererComponents as renderer,
  FormBuilderControls,
  Task,
};

/**
 * Gets the screen parent or null if don't have
 * @returns {object|null}
 */
function findScreenOwner(control) {
  let owner = control.$parent;
  while (owner) {
    const isScreen = owner.$options.name === "ScreenContent";
    if (isScreen) {
      return owner;
    }
    owner = owner.$parent;
  }
  return null;
}

// Export our Vue plugin as our default
export default {
  install(Vue) {
    // First check to see if we're already installed
    /* istanbul ignore next */
    if (Vue._processMakerVueFormBuilderInstalled) {
      return;
    }

    // Boolean flag to see if we're already installed
    Vue._processMakerVueFormBuilderInstalled = true;

    // Register the builder and renderer
    Vue.component('AddLoopRow', AddLoopRow);
    Vue.component('FormImage', FormImage);
    Vue.component('FormLoop', FormLoop);
    Vue.component('FormMultiColumn', FormMultiColumn);
    Vue.component('FormNestedScreen', FormNestedScreen);
    Vue.component('FormRecordList', FormRecordList);
    Vue.component('Loop', Loop);
    Vue.component('MultiColumn', MultiColumn);
    Vue.component('NewFormMultiColumn', NewFormMultiColumn);
    Vue.component('ScreenRenderer', ScreenRenderer);
    Vue.component('task', Task);
    Vue.component('vue-form-builder', VueFormBuilder);
    Vue.component('vue-form-renderer', VueFormRenderer);
    Vue.component('default-loading-spinner', DefaultLoadingSpinner);
    Vue.component('FormButton', FormButton);
    Vue.component('FileUpload', FileUpload);
    Vue.component('FileDownload', FileDownload);

    Vue.component('FormMaskedInput', FormMaskedInput);
    Vue.use(DataProvider);

    Vue.use(Vuex);
    const store = new Vuex.Store({
      modules: {
        globalErrorsModule,
        // @todo Improve how to load this module, it is used only in the form builder, not used in the form renderer.
        undoRedoModule
      }
    });
    Vue.mixin({ store });

    //Helper to access data reference.
    Vue.mixin({ methods:{ getScreenDataReference(customProperties = null, setter = null) {
          const control = this;
          const screen = findScreenOwner(control);
          return screen.getDataReference(customProperties, setter);
        }}});
  }
};

/**
 * Initialize the axios cache adapter
 *
 * @param {Object} apiClient
 * @param {Object} screenConfig
 */
export function initializeScreenCache(apiClient, screenConfig) {
  apiClient.defaults.adapter = cacheAdapterEnhancer(
    apiClient.defaults.adapter,
    screenConfig.cacheEnabled,
    "useCache",
    new LRUCache({
      ttl: screenConfig.cacheTimeout,
      max: 100
    })
  );
}
