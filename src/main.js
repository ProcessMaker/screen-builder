/* istanbul ignore file */
import Vue from "vue";
import App from "./App.vue";
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
import TestComponents from "../tests/components";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.config.productionTip = false;

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({ lng: "en" });
Vue.mixin({ i18n: new VueI18Next(i18next) });
Vue.use(Vuex);
Vue.use(ScreenBuilder);
Vue.use(VueFormElements);
Vue.component("Multiselect", Multiselect);

// Stub for standalone. Real one is in core.
Vue.component("Required", {
  template: '<div class="text-right"><small>* = Required</small></div>'
});

// Mock PmqlInput for test/standalone
Vue.component("PmqlInput", {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  template: '<div>PMQL: {{ value }}</div>'
});

const store = new Vuex.Store({
  modules: {
    globalErrorsModule,
    undoRedoModule
  }
});

window.exampleScreens = [
  {
    id: 1,
    screen_category_id: 1,
    title: "Sub screen example",
    description: "A sub screen example",
    type: "FORM",
    config: [
      {
        name: "Sub screen example",
        items: [
          {
            config: {
              icon: "far fa-square",
              label: "First name",
              name: "firstname",
              placeholder: "",
              validation: "",
              helper: null,
              type: "text",
              dataFormat: "string",
              customCssSelector: "first-name"
            },
            inspector: [],
            component: "FormInput",
            "editor-component": "FormInput",
            "editor-control": "FormInput",
            label: "Line Input",
            value: "__vue_devtool_undefined__"
          },
          {
            config: {
              icon: "far fa-square",
              label: "Last name",
              name: "lastname",
              placeholder: "",
              validation: "",
              helper: null,
              type: "text",
              dataFormat: "string",
              customCssSelector: ""
            },
            inspector: [],
            component: "FormInput",
            "editor-component": "FormInput",
            "editor-control": "FormInput",
            label: "Line Input",
            value: "__vue_devtool_undefined__"
          }
        ]
      }
    ],
    computed: [],
    watchers: [],
    custom_css: "[selector='first-name'] label { font-style: italic; }",
    status: "ACTIVE"
  }
];

const exampleUsers = [
  {
    id: 1,
    username: 'admin',
    status: 'ACTIVE',
    fullname: 'Administrator',
  },
  {
    id: 2,
    username: 'jdavis',
    status: 'INACTIVE',
    fullname: 'Jonathan Davis',
  }
];

const exampleGroups = [
  {
    id: 1,
    name: 'Super Users',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Metalheads',
    status: 'INACTIVE',
  }
];

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
        }  else if (url === "users") {
            resolve({
              data: {
                data: exampleUsers
              }
            });
        }  else if (url === "groups") {
            resolve({
              data: {
                data: exampleGroups
              }
            });
        }  else if (url.substr(0, 6) === "users/") {
          const index = url.substr(6, 1);
          resolve({
            data: exampleUsers[index - 1]
          });
        }  else if (url.substr(0, 7) === "groups/") {
          const index = url.substr(7, 1);
          resolve({
            data: exampleGroups[index - 1]
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
        switch (url) {
          case "/requests/data_sources/1":
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
            break;
          case "/api/1.0/encrypted_data/encryptText":
            resolve("62abf17e-d1a6-4f68-a382-ed63872d29b0");
            break;
          case "/api/1.0/encrypted_data/decryptText":
            resolve("Secret Value");
            break;
          default:
            window.axios
              .post(url, body)
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        }
      });
    },
    put() {
      return new Promise((resolve) => {
        resolve({
          data: {
            response: []
          }
        });
      });
    },
    delete() {
      return new Promise((resolve) => {
        resolve({
          data: {
            response: []
          }
        });
      });
    }
  },
  EventBus: new Vue(),
  confirmModal(title, message, variant, callback) {
    if (window.confirm(`${title}: ${message}`)) {
      callback();
    }
  },
  alert(message, variant) {
    console.log(`${variant}: ${message}`);
  },
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

// Setup axios
window.axios = axios.create({
  adapter: cacheAdapterEnhancer(axios.getAdapter(axios.defaults.adapter), {
    enabledByDefault: window.ProcessMaker.screen.cacheEnabled,
    cacheFlag: "useCache",
    defaultCache: new LRUCache({
      ttl: window.ProcessMaker.screen.cacheTimeout,
      max: 100
    })
  })
});

// Setup api versions
const apiVersionConfig = [
  { version: "1.0", baseURL: "/api/1.0/" },
  { version: "1.1", baseURL: "/api/1.1/" },
];

window.axios.defaults.baseURL = apiVersionConfig[0].baseURL;
window.axios.interceptors.request.use((config) => {
  if (typeof config.url !== "string" || !config.url) {
    throw new Error("Invalid URL in the request configuration");
  }

  apiVersionConfig.forEach(({ version, baseURL }) => {
    const versionPrefix = `/api/${version}/`;
    if (config.url.startsWith(versionPrefix)) {
      // eslint-disable-next-line no-param-reassign
      config.baseURL = baseURL;
      // eslint-disable-next-line no-param-reassign
      config.url = config.url.replace(versionPrefix, "");
    }
  });

  return config;
});

const searchParams = new URLSearchParams(window.location.search);

const scenario = searchParams?.get("scenario");
if (scenario) {
  if (!TestComponents[scenario]) {
    // eslint-disable-next-line no-console
    console.error(`Not found tests/components/${scenario}.vue`);
  } else {
    window.vueInstance = new Vue({
      store,
      render: (h) => h(TestComponents[scenario])
    }).$mount("#app");
  }
} else {
  window.vueInstance = new Vue({
    store,
    render: (h) => h(App)
  }).$mount("#app");
}
