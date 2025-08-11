// Import our components
import VueFormElements from "@processmaker/vue-form-elements";
import VueFormBuilder from "./vue-form-builder.vue";
import VueFormRenderer from "./vue-form-renderer.vue";
import * as renderer from "./renderer";
import FormMultiColumn from "./renderer/form-multi-column.vue";
import * as inspector from "./inspector";
import FormBuilderControls from "../form-builder-controls";
import Task from "./task.vue";
import Loop from "./editor/loop.vue";
import MultiColumn from "./editor/multi-column.vue";
import FormLoop from "./renderer/form-loop.vue";
import NewFormMultiColumn from "./renderer/new-form-multi-column.vue";
import FormNestedScreen from "./renderer/form-nested-screen.vue";
import ScreenRenderer from "./screen-renderer.vue";
import AddLoopRow from "./renderer/add-loop-row.vue";
import FormRecordList from "./renderer/form-record-list.vue";
import FormImage from "./renderer/form-image.vue";
import FormAvatar from "./renderer/form-avatar.vue";
import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import FormButton from "./renderer/form-button.vue";
import FileUpload from "./renderer/file-upload.vue";
import FileDownload from "./renderer/file-download.vue";
import FormMaskedInput from "./renderer/form-masked-input.vue";
import DefaultLoadingSpinner from "./utils/default-loading-spinner.vue";
import DataProvider from "../DataProvider";
import { cacheAdapterEnhancer } from "axios-extensions";
import { LRUCache } from "lru-cache";
import Vuex from "vuex";
import globalErrorsModule from "../store/modules/globalErrorsModule";
import undoRedoModule from "../store/modules/undoRedoModule";
import clipboardModule from "../store/modules/clipboardModule";
import BasicSearch from "./basic-search.vue";
import ComputedProperties from "./computed-properties.vue";
import CustomCSS from "./custom-css.vue";
import WatchersForm from "./watchers-form.vue";
import WatchersList from "./watchers-list.vue";
import WatchersPopup from "./watchers-popup.vue";
import WatchersSynchronous from "./watchers-synchronous.vue";
import {
  DataFormatProperty,
  DataTypeBooleanProperty,
  DataTypeDateTimeProperty,
  DataTypeProperty,
  DataTypeWithoutDateProperty
} from "../VariableDataTypeProperties";
import FormListTable from "./renderer/form-list-table.vue";
import FormAnalyticsChart from "./renderer/form-analytics-chart.vue";
import accordions from "@/components/accordions";
import VariableNameGenerator from "@/components/VariableNameGenerator";
import { LinkButton, CaseProgressBar } from "./renderer";
import "../assets/css/tabs.css";
import FormCollectionRecordControl from "./renderer/form-collection-record-control.vue";
import FormCollectionViewControl from "./renderer/form-collection-view-control.vue";

const rendererComponents = {
  ...renderer,
  FormMultiColumn
};
export {default as globalProperties, formTypes} from "../global-properties";
export {
  bgcolorProperty,
  colorProperty,
  javascriptReservedKeywords,
  keyNameProperty,
  labelProperty,
  buttonLabelProperty,
  placeholderProperty,
  helperTextProperty,
  readonlyProperty,
  disabledProperty,
  validationRulesProperty,
  toggleStyleProperty,
  buttonVariantStyleProperty,
  defaultValueProperty,
  buttonTypeEvent,
  tooltipProperty,
  deviceVisibilityProperty,
  LoadingSubmitButtonProperty,
  LabelSubmitButtonProperty
} from "../form-control-common-properties";

// Export our named exports
export {
  VueFormBuilder,
  VueFormRenderer,
  inspector,
  rendererComponents as renderer,
  FormBuilderControls,
  Task,
  BasicSearch,
  ComputedProperties,
  CustomCSS,
  WatchersForm,
  WatchersList,
  WatchersPopup,
  WatchersSynchronous,
  DataTypeProperty,
  DataTypeWithoutDateProperty,
  DataTypeBooleanProperty,
  DataTypeDateTimeProperty,
  DataFormatProperty,
  globalErrorsModule,
  accordions,
  VariableNameGenerator
};
export * from "./inspector";
export * from "./renderer";
export * as Currencies from "../currency.json";
export * from "./utils";
export * from "./editor";
export * from "../mixins";

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
    Vue.component("FormAvatar", FormAvatar);
    Vue.component("FormLoop", FormLoop);
    Vue.component("FormMultiColumn", FormMultiColumn);
    Vue.component("FormNestedScreen", FormNestedScreen);
    Vue.component("FormRecordList", FormRecordList);
    Vue.component("Loop", Loop);
    Vue.component("MultiColumn", MultiColumn);
    Vue.component("NewFormMultiColumn", NewFormMultiColumn);
    Vue.component("ScreenRenderer", ScreenRenderer);
    Vue.component("Task", Task);
    Vue.component("VueFormBuilder", VueFormBuilder);
    Vue.component("VueFormRenderer", VueFormRenderer);
    Vue.component("DefaultLoadingSpinner", DefaultLoadingSpinner);
    Vue.use(VueFormElements);
    Vue.component("FormButton", FormButton);
    Vue.component("FileUpload", FileUpload);
    Vue.component("FileDownload", FileDownload);
    Vue.component("FormAnalyticsChart", FormAnalyticsChart);
    Vue.component("FormMaskedInput", FormMaskedInput);
    Vue.use(DataProvider);

    Vue.use(Vuex);
    Vue.component("FormListTable", FormListTable);
    Vue.component("LinkButton", LinkButton);
    Vue.component("CaseProgressBar", CaseProgressBar);
    Vue.component("FormCollectionRecordControl", FormCollectionRecordControl);
    Vue.component("FormCollectionViewControl", FormCollectionViewControl);
    const store = new Vuex.Store({
      modules: {
        globalErrorsModule,
        // @todo Improve how to load this module, it is used only in the form builder, not used in the form renderer.
        undoRedoModule,
        clipboardModule
      }
    });
    Vue.mixin({ store });

    // Helper to access data reference.
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
    {
      enabledByDefault: window.ProcessMaker.screen.cacheEnabled,
      cacheFlag: "useCache",
      defaultCache: new LRUCache({
        ttl: window.ProcessMaker.screen.cacheTimeout,
        max: 100
      })
    }
  );
}
