/* eslint-disable vue/multi-word-component-names */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import Vue from "vue";
import i18next from "i18next";
import VueI18Next from "@panter/vue-i18next";
import Vuex from "vuex";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { Multiselect } from "@processmaker/vue-multiselect";
import { LRUCache } from "lru-cache";
import VueFormElements from "@processmaker/vue-form-elements";
import { configure } from "@storybook/test"; // Required for testing
import undoRedoModule from "@/store/modules/undoRedoModule";
import globalErrorsModule from "@/store/modules/globalErrorsModule";
import ScreenBuilder from "@/components";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import "@processmaker/vue-multiselect/dist/vue-multiselect.min.css";

// For QA: Set default testIdAttribute to "data-test"
configure({ testIdAttribute: "data-test" });

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.config.productionTip = false;
Vue.use(VueI18Next);
i18next.init({ lng: "en" });
Vue.mixin({ i18n: new VueI18Next(i18next) });
Vue.use(Vuex);
Vue.use(ScreenBuilder);
Vue.use(VueFormElements);
Vue.component("Multiselect", Multiselect);

export const store = new Vuex.Store({
  modules: {
    globalErrorsModule,
    undoRedoModule
  }
});

// get cache config from header
const cacheEnabled = document.head.querySelector(
  "meta[name='screen-cache-enabled']"
);
const cacheTimeout = document.head.querySelector(
  "meta[name='screen-cache-timeout']"
);

// Get the current protocol, hostname, and port
const { protocol, hostname, port } = window.location;
window.ProcessMaker = {
  isStub: true,
  user: {
    id: 1,
    lang: "en"
  },
  app: {
    url: `${protocol}//${hostname}:${port}` // Create a URL with the current port
  },
  EventBus: new Vue(),
  confirmModal(title, message, variant, callback) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`${title}: ${message}`)) {
      callback();
    }
  },
  // eslint-disable-next-line no-unused-expressions, no-unused-vars
  alert(message, variant) {},
  screen: {
    cacheEnabled: cacheEnabled ? cacheEnabled.content === "true" : false,
    cacheTimeout: cacheTimeout ? Number(cacheTimeout.content) : 0
  }
};
window.Echo = {
  listeners: [],
  private() {
    return {
      notification(callback) {
        window.Echo.listeners.push({ callback });
      },
      stopListening() {
        window.Echo.listeners.splice(0);
      },
      listen(event, callback) {
        window.Echo.listeners.push({ event, callback });
      }
    };
  }
};

// axios
window.axios = axios.create({
  baseURL: "/api/1.0/",
  adapter: cacheAdapterEnhancer(axios.getAdapter(axios.defaults.adapter), {
    enabledByDefault: window.ProcessMaker.screen.cacheEnabled,
    cacheFlag: "useCache",
    defaultCache: new LRUCache({
      ttl: window.ProcessMaker.screen.cacheTimeout,
      max: 100
    })
  })
});

window.ProcessMaker.apiClient = window.axios;

export default { ScreenBuilder };
