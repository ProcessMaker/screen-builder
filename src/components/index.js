// Import our components
import VueFormBuilder from './vue-form-builder';
import VueFormRenderer from './vue-form-renderer';
import * as renderer from './renderer';
import FormMultiColumn from './renderer/form-multi-column';
import * as inspector from './inspector';
import FormBuilderControls from '../form-builder-controls';
import Task from './task';
import Loop from './editor/loop';
import MultiColumn from './editor/multi-column';
import FormLoop from './renderer/form-loop';
import NewFormMultiColumn from './renderer/new-form-multi-column';
import FormNestedScreen from './renderer/form-nested-screen';
import ScreenRenderer from './screen-renderer';
import AddLoopRow from './renderer/add-loop-row';
import FormRecordList from './renderer/form-record-list';
import FormImage from './renderer/form-image';
import VueFormElements from '@processmaker/vue-form-elements';
import FormButton from './renderer/form-button';
import FileUpload from './renderer/file-upload.vue';
import FileDownload from './renderer/file-download.vue';
import FormMaskedInput from './renderer/form-masked-input';
import DefaultLoadingSpinner from './utils/default-loading-spinner';
import DataProvider from '../DataProvider';
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
    Vue.use(VueFormElements);
    Vue.component('FormButton', FormButton);
    Vue.component('FileUpload', FileUpload);
    Vue.component('FileDownload', FileDownload);

    Vue.component('FormMaskedInput', FormMaskedInput);
    Vue.use(DataProvider);

    Vue.use(Vuex);
    const store = new Vuex.Store({
      modules: {
        globalErrorsModule,
        // @todo this module is used in the form builder, but is not used in the form renderer
        undoRedoModule
      }
    });
    Vue.mixin({ store });
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
