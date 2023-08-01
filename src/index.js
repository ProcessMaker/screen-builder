// Import our components
import * as renderer from './components/renderer';
import * as inspector from './components/inspector';
import * as components from './components';
import FormBuilderControls from './form-builder-controls';
import DataProvider from './DataProvider';
import { cacheAdapterEnhancer } from "axios-extensions";
import LRUCache from "lru-cache";
import Vuex from "vuex";
import globalErrorsModule from "@/store/modules/globalErrorsModule";
import undoRedoModule from "@/store/modules/undoRedoModule";

// Export our named exports
export {
  inspector,
  renderer,
  FormBuilderControls,
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

    for (const key in components) {
      Vue.component(key, components[key]);
    }
    for (const key in renderer) {
      Vue.component(key, renderer[key]);
    }
    for (const key in inspector) {
      Vue.component(key, inspector[key]);
    }
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

export * from './components';

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
