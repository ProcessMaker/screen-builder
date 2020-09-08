/* istanbul ignore file */

export default {
  apiInstance: null,
  install(Vue) {
    Vue.prototype.$dataProvider = this;
  },
  get(...args) {
    return window.ProcessMaker.apiClient.get(...args);
  },
};
