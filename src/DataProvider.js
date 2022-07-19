/* istanbul ignore file */
import axios from 'axios';
import _ from 'lodash';

export default {
  screensCache: [],
  cachedScreenPromises: [],

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
  delete(...args) {
    return this.apiInstance().delete(...args);
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
    return this.get(endpoint + params).then(response => {
      if (response.data.screen && response.data.screen.nested) {
        this.addNestedScreenCache(response.data.screen.nested);
      }
      return response;
    });
  },
  addNestedScreenCache(nested) {
    nested.forEach(screen => {
      if (screen.screen_id) {
        // It's from a screen version, so reference it by it's parent id
        screen.id = screen.screen_id;
      }
      const index = this.screensCache.findIndex(s => s.id == screen.id);
      if (index > -1) {
        this.screensCache.splice(index, 1, screen);
      } else {
        this.screensCache.push(screen);
      }
    });
  },
  getScreen(id, query='') {
    let cachedPromise = this.cachedScreenPromises.find(item => item.id === id && item.query === query);
    if (cachedPromise) {
      return cachedPromise.screenPromise;
    }
    else {
      const endpoint = _.get(window, 'PM4ConfigOverrides.getScreenEndpoint', '/screens');
      
      const screensCacheHit = this.screensCache.find(screen => screen.id == id);
      if (screensCacheHit) {
        return Promise.resolve({data: screensCacheHit});
      }

      let screenPromise = new Promise((resolve, reject) => {
        this.get(endpoint + `/${id}${query}`)
          .then(response => {
            if (response.data.nested) {
              this.addNestedScreenCache(response.data.nested);
            }
            resolve(response);
          })
          .catch(response => reject(response));
      });
      this.cachedScreenPromises.push({id, query, screenPromise});
      return screenPromise;
    }
  },

  flushScreenCache() {
    this.cachedScreenPromises.splice(0, this.cachedScreenPromises.length);
  },

  postScript(id, params, options = {}) {
    let endpoint = _.get(
      window,
      'PM4ConfigOverrides.postScriptEndpoint',
      '/scripts/execute/{id}'
    );

    return this.post(
      endpoint.replace('{id}', id) + this.authQueryString(),
      params,
      options
    );
  },

  postDataSource(scriptId, requestId, params) {
    let url;
    if (requestId) {
      url = `/requests/${requestId}/data_sources/${scriptId}`;
    } else {
      url = `/requests/data_sources/${scriptId}`;
    }
    url += this.authQueryString();

    //TODO added for a problem present in cypress tests
    console.log('post datasource');
    if (window.ProcessMaker && !window.ProcessMaker.debounce) {
      return this.post(url, params, { timeout: 0});
    }

    if (window.ProcessMaker.cachedDataSources === undefined) {
      window.ProcessMaker.cachedDataSources = [];
    }
    let cachedDataSources = window.ProcessMaker.cachedDataSources;
    let cached = cachedDataSources.find(item => item.url === url);
    if (cached) {
      return cached.value;
    }
    else {
      let post = this.post(url, params, { timeout: 0});
      cachedDataSources.push({url, value: post});
      return post;
    }
  },

  authQueryString() {
    const authParams = _.get(
      window,
      'PM4ConfigOverrides.authParams',
      null
    );

    let query = '';
    if (authParams) {
      query = '?' + (new URLSearchParams(authParams)).toString();
    }

    return query;
  },

  deleteFile(id, token = null) {
    let url = `files/${id}`;
    if (token) {
      url += `?token=${token}`;
    }
    return this.delete(url);
  },

  download(url) {
    return this.apiInstance().get(url, {responseType: 'blob'});
  },
};