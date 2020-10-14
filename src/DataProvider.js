/* istanbul ignore file */
import axios from 'axios';
import _ from 'lodash';

export default {
  install(Vue) {
    Vue.prototype.$dataProvider = this;
  },
  apiInstance() {
    // Use the real apiClient
    if (_.has(window, 'ProcessMaker.apiClient') && !window.ProcessMaker.isStub) {
      return window.ProcessMaker.apiClient;
    }

    // Allow standalone app to use a real api if token and baseURL are present
    if (this.token()) {
      axios.defaults.baseURL = this.baseURL();
      axios.defaults.headers.common = {
        'Authorization': 'Bearer ' + this.token(),
      };
      return axios;
    }

    // If the apiClient is a stub, use it for running tests
    if (_.has(window, 'ProcessMaker.apiClient') && window.ProcessMaker.isStub) {
      return window.ProcessMaker.apiClient;
    }

    // For anything else, use a dummy api client
    return {
      get() {
        return Promise.resolve({
          data: {
            data: [],
          },
        });
      },
    };
  },
  get(...args) {
    return this.apiInstance().get(...args);
  },
  post(...args) {
    return this.apiInstance().post(...args);
  },
  token() {
    return localStorage.getItem('token');
  },
  baseURL() {
    return localStorage.getItem('baseURL');
  },
  
  // Methods below are used in the components
  
  getTasks(params) {
    const endpoint = _.get(window, 'PM4ConfigOverrides.getTasksEndpoint', '/tasks');
    return this.get(endpoint + params);
  },
  
  getScreen(id, query = '') {
    const endpoint = _.get(window, 'PM4ConfigOverrides.getScreenEndpoint', '/screens');
    return this.get(endpoint + `/${id}${query}`);
  },
  
  postScript(id, params) {
    const endpoint = '/scripts/execute/{id}';

    const authParams = _.get(
      window,
      'PM4ConfigOverrides.authParams',
      null
    );

    let query = '';
    if (authParams) {
      query = '?' + (new URLSearchParams(authParams)).toString();
    }

    return this.post(
      endpoint.replace('{id}', id) + query,
      params
    );
  },
};