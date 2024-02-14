/* eslint-disable vue/multi-word-component-names */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import Vue from "vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import i18next from "i18next";
import VueI18Next from "@panter/vue-i18next";
import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import Vuex from "vuex";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { Multiselect } from "@processmaker/vue-multiselect";
import "@processmaker/vue-multiselect/dist/vue-multiselect.min.css";
import { LRUCache } from "lru-cache";
import VueFormElements from "@processmaker/vue-form-elements";
import undoRedoModule from "@/store/modules/undoRedoModule";
import globalErrorsModule from "@/store/modules/globalErrorsModule";
import ScreenBuilder from "@/components";

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
  apiClient: {
    create() {
      return this;
    },
    defaults: {
      headers: {
        common: {
          "X-CSRF-TOKEN": "token"
        }
      }
    },
    get(url, params) {
      return new Promise((resolve, reject) => {
        let screen;
        if (url.substr(0, 8) === "screens/") {
          screen = window.exampleScreens.find((s) => s.id == url.substr(8));
        }
        if (url.substr(0, 8) === "screens/" && screen) {
          resolve({ data: screen });
        } else if (url === "screens") {
          resolve({
            data: {
              data: window.exampleScreens
            }
          });
        } else if (url === "/data_sources/1") {
          resolve({
            data: {
              endpoints: {
                list: {}
              }
            }
          });
        } else if (url === "/data_sources") {
          resolve({
            data: {
              data: [
                {
                  id: 1,
                  name: "Persons",
                  endpoints: {
                    list: {}
                  }
                }
              ]
            }
          });
        } else {
          window.axios
            .get(url, params)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        }
      });
    },
    post(url, body) {
      return new Promise((resolve, reject) => {
        if (url === "/requests/data_sources/1") {
          resolve({
            data: {
              response: [
                { value: 1, content: "James" },
                { value: 2, content: "John" },
                { value: 3, content: "Mary" },
                { value: 4, content: "Patricia" }
              ]
            }
          });
        } else {
          window.axios
            .post(url, body)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        }
      });
    },
    put() {
      return Promise.resolve({
        data: {
          response: []
        }
      });
    },
    delete() {
      return Promise.resolve({
        data: {
          response: []
        }
      });
    }
  },
  EventBus: new Vue(),
  confirmModal(title, message, variant, callback) {
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
  watcherMocks(body, response) {
    this.listeners.forEach((listener) => {
      setTimeout(() => {
        listener.callback({
          type: ".ProcessMaker\\Events\\ScriptResponseEvent",
          watcher: body.watcher,
          response
        });
      }, 1000);
    });
  },
  eventMocks(event, response) {
    this.listeners.forEach((listener) => {
      setTimeout(() => {
        listener.callback({
          type: event,
          response
        });
      }, 1000);
    });
  },
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

export default { ScreenBuilder };
