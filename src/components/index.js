// Import our components
import * as renderer from "./renderer";
import * as inspector from "./inspector";
import DataProvider from "../DataProvider";
import { cacheAdapterEnhancer } from "axios-extensions";
import LRUCache from "lru-cache";
import Vuex from "vuex";
import globalErrorsModule from "@/store/modules/globalErrorsModule";
import undoRedoModule from "@/store/modules/undoRedoModule";
import FormListTable from "./renderer/form-list-table";
import FormAnalyticsChart from "./renderer/form-analytics-chart";

const rendererComponents = {
  ...renderer,
  FormMultiColumn
};

// Export our named exports
export { VueFormBuilder, VueFormRenderer, inspector, rendererComponents as renderer, FormBuilderControls, Task };

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
    Vue.component("AddLoopRow", AddLoopRow);
    Vue.component("FormImage", FormImage);
    Vue.component("FormLoop", FormLoop);
    Vue.component("FormMultiColumn", FormMultiColumn);
    Vue.component("FormNestedScreen", FormNestedScreen);
    Vue.component("FormRecordList", FormRecordList);
    Vue.component("Loop", Loop);
    Vue.component("MultiColumn", MultiColumn);
    Vue.component("NewFormMultiColumn", NewFormMultiColumn);
    Vue.component("ScreenRenderer", ScreenRenderer);
    Vue.component("task", Task);
    Vue.component("vue-form-builder", VueFormBuilder);
    Vue.component("vue-form-renderer", VueFormRenderer);
    Vue.component("default-loading-spinner", DefaultLoadingSpinner);
    Vue.use(VueFormElements);
    Vue.component("FormButton", FormButton);
    Vue.component("FileUpload", FileUpload);
    Vue.component("FileDownload", FileDownload);
    Vue.component("FormAnalyticsChart", FormAnalyticsChart);
    Vue.component("FormMaskedInput", FormMaskedInput);
    Vue.use(DataProvider);

    Vue.use(Vuex);
    Vue.component("FormListTable", FormListTable);
    const store = new Vuex.Store({
      modules: {
        globalErrorsModule,
        // @todo Improve how to load this module, it is used only in the form builder, not used in the form renderer.
        undoRedoModule
      }
    });
    Vue.mixin({ store });

    //Helper to access data reference.
    Vue.mixin({
      methods: {
        getScreenDataReference(customProperties = null, setter = null) {
          const control = this;
          const screen = findScreenOwner(control);
          return screen.getDataReference(customProperties, setter);
        }
      }
    });
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
