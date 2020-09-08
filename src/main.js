/* istanbul ignore file */
import Vue from 'vue';
import App from './App.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import Vuex from 'vuex';
import ScreenBuilder from '@/components';
import Vuetable from 'vuetable-2/src/components/Vuetable';
import axios from 'axios';

Vue.config.productionTip = false;

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({lng: 'en'});
Vue.mixin({i18n: new VueI18Next(i18next)});
Vue.use(Vuex);
Vue.use(ScreenBuilder);
Vue.component('vuetable', Vuetable);

const store = new Vuex.Store({ modules: {} });

window.axios = axios.create({
  baseURL: '/api/1.0/',
});

window.ProcessMaker = {
  isStub: false,//true,
  user: {
    id: 1,
    lang: 'en',
  },
  apiClient: {
    defaults: {
      headers: {
        common: {
          'X-CSRF-TOKEN': 'token',
        },
      },
    },
    get(url) {
      return new Promise((resolve, reject) => {
        const exampleScreen = {
          id: 1,
          screen_category_id: 1,
          title: 'Sub screen example',
          description: 'A sub screen example',
          type: 'FORM',
          config: [
            {
              name: 'Sub screen example',
              items: [
                {
                  'config': {
                    'icon': 'far fa-square',
                    'label': 'First name',
                    'name': 'firstname',
                    'placeholder': '',
                    'validation': '',
                    'helper': null,
                    'type': 'text',
                    'dataFormat': 'string',
                    'customCssSelector': 'first-name',
                  },
                  'inspector': [],
                  'component': 'FormInput',
                  'editor-component': 'FormInput',
                  'editor-control': 'FormInput',
                  'label': 'Line Input',
                  'value': '__vue_devtool_undefined__',
                },
                {
                  'config': {
                    'icon': 'far fa-square',
                    'label': 'Last name',
                    'name': 'lastname',
                    'placeholder': '',
                    'validation': '',
                    'helper': null,
                    'type': 'text',
                    'dataFormat': 'string',
                    'customCssSelector': '',
                  },
                  'inspector': [],
                  'component': 'FormInput',
                  'editor-component': 'FormInput',
                  'editor-control': 'FormInput',
                  'label': 'Line Input',
                  'value': '__vue_devtool_undefined__',
                },
              ],
            },
          ],
          computed: [],
          watchers: [],
          custom_css: '[selector=\'first-name\'] label { font-style: italic; }',
          status: 'ACTIVE',
        };
        if (url === 'screens/1') {
          resolve({data: exampleScreen});
        } else if (url === 'screens') {
          resolve({ data: {
            data: [exampleScreen],
          }});
        } else if (url === '/data_sources/1') {
          resolve({
            data: {
              endpoints: {
                'list': { },
              },
            },
          });
        } else if (url === '/data_sources') {
          resolve({data: {
            data: [
              {id: 1, name: 'Persons', endpoints: {
                'list': { },
              }},
            ],
          }});
        } else {
          window.axios.get(url)
            .then(response => resolve(response))
            .catch(error => reject(error));
        }
      });
    },
    post(url, body) {
      return new Promise((resolve, reject) => {
        switch (url) {
          case '/scripts/execute/1':
            window.Echo.watcherMocks(body, {
              key: '1',
            });
            break;
          case '/requests/data_sources/1':
            resolve({data: {
              response: [
                {value: 1, content: 'James'},
                {value: 2, content: 'John'},
                {value: 3, content: 'Mary'},
                {value: 4, content: 'Patricia'},
              ], 
            }});
            break;
          default:
            window.axios.post(url, body)
              .then(response => resolve(response))
              .catch(error => reject(error));
        }
      });
    },
  },
  EventBus: new Vue(),
  confirmModal(title, message, variant, callback) {
    if (window.confirm(`${title}: ${message}`)) {
      callback();
    }
  },
  alert(message, variant) {
    variant;
    message;
  },
};
window.Echo = {
  listeners: [],
  watcherMocks(body, response) {
    this.listeners.forEach((listener) => {
      setTimeout(() => {
        listener.callback({
          type: 'ProcessMaker\\Notifications\\ScriptResponseNotification',
          watcher: body.watcher,
          response,
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
    };
  },
};
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
