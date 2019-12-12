import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import Vuex from 'vuex';
import ScreenBuilder from '@/components';

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
