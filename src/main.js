import Vue from 'vue';
import App from './App.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import Vuex from 'vuex';
import ScreenBuilder from '@/components';
import Vuetable from 'vuetable-2/src/components/Vuetable';

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

window.ProcessMaker = {
  isStub: true,
  user: {
    id: 1,
  },
  apiClient: {
    get(url) {
      return new Promise((resolve) => {
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
        } else if (url.substr(0, 7) === 'screens') {
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
        } else if (url === '/scripts/execution/1') {
          resolve({
            data: {
              name: 'Steve',
            },
          });
        }
      });
    },
    post(url, body) {
      switch (url) {
        case '/scripts/execute/1':
          window.Echo.watcherMocks(body, {
            key: '1',
          });
          break;
      }
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
  watcherMocks(watcher, response) {
    this.listeners.forEach((listener) => {
      setTimeout(() => {
        listener.callback({
          type: 'ProcessMaker\\Notifications\\ScriptResponseNotification',
          watcher: watcher.watcher,
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
    };
  },
};
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
