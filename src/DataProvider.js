import axios from 'axios';

export default {
  apiInstance: null,
  install(Vue, options) {
    Vue.prototype.$dataProvider = this;
    
    // make sure we're not using the stub in main.js
    // temporary until the stub is moved here.
    if (window && window.ProcessMaker && !window.ProcessMaker.isStub) {
      this.apiInstance = window.ProcessMaker.apiClient;
      return;
    }

    if (this.token() && !this.apiInstance) {
      axios.defaults.baseURL = this.baseURL();
      axios.defaults.headers.common = {
        'Authorization': 'Bearer ' + this.token(),
      };
      this.apiInstance = axios;
    }

    // use a dummy api client
    if (!this.axiosInstance) {
      this.axiosInstance = {
        get(...args) {
          return Promise.resolve({
            data: {
              data: []
            }
          });
        },
      }
    }

  },
  get(...args) {
   return this.apiInstance.get(...args);
  },
  token() {
    return localStorage.getItem('token');
  },
  baseURL() {
    return localStorage.getItem('baseURL');
  },
}