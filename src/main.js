import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import Vuex from 'vuex';
import ScreenBuilder from '@/components';

window.ProcessMaker = {
  apiClient: {
    get(params) {

      if (params === '/data_sources') {
        return new Promise((resolve) => {
          resolve({status:200, data: {data: [{id: 1, name:'TestDS1'}, {id:2, name:'TestDS2'}]}});
        });
      }

      if (params === '/data_sources/1') {
        return new Promise((resolve) => {
          resolve({status:200, data: {
              endpoints: {
                list: {
                  url: "UrlEndPointList"
                }
              }
          }});
        });
      }

      if (params === '/requests/data_sources/1') {
        return new Promise((resolve) => {
          resolve({status:200, data: [
            {
              userId: 1,
              id: 1,
              title: 'Post 1',
              body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae' +
                ' ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
            },
            {
              userId: 1,
              id: 2,
              title: 'Post 2',
              body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat' +
                ' blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
            },
            {
              userId: 1,
              id: 3,
              title: 'Post 3',
              body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel' +
                ' accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
            },
          ]});
        });
      }
    },
    put(params) {return new Promise((resolve) => { resolve({status:200, url: params}); });},
    post(params) {
      console.log(params);
      if (params === '/requests/data_sources/1') {
        return new Promise((resolve) => {
          resolve({status:200, data: {response:[
            {
              userId: 1,
              id: 1,
              title: 'Post 1',
              body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae' +
                ' ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
            },
            {
              userId: 1,
              id: 2,
              title: 'Post 2',
              body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat' +
                ' blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
            },
            {
              userId: 1,
              id: 3,
              title: 'Post 3',
              body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel' +
                ' accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
            },
          ]}});
        });
      }
    },
    delete(params) {return new Promise((resolve) => { resolve({status:200, url: params}); });},
  },
};

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({lng: 'en'});
Vue.mixin({ i18n: new VueI18Next(i18next) });
Vue.use(Vuex);
Vue.use(ScreenBuilder);

const store = new Vuex.Store({ modules: {} });

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
