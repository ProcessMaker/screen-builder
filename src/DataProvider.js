import axios from 'axios';
export default {
  install(Vue, options) {
    Vue.prototype.$dataProvider = this;
  },
  apiInstance() {
    if (_.has(window, 'ProcessMaker.apiClient') && !window.ProcessMaker.isStub) {
      return window.ProcessMaker.apiClient;
    }
    if (this.token()) {
      axios.defaults.baseURL = this.baseURL();
      axios.defaults.headers.common = {
        'Authorization': 'Bearer ' + this.token(),
      };
      return axios;
    }
    // use a dummy api client
    return {
      get(...args) {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      },
    }
  },
  get(...args) {
   return this.apiInstance().get(...args);
  },
  token() {
    return localStorage.getItem('token');
  },
  baseURL() {
    return localStorage.getItem('baseURL');
  },
}