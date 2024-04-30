/* istanbul ignore file */
import axios from "axios";
import { has, get } from "lodash";
import { cacheAdapterEnhancer } from "axios-extensions";
import { LRUCache } from "lru-cache";
import i18next from "i18next";

const FIVE_MINUTES = 1000 * 60 * 5;

export default {
  screensCache: [],
  cachedScreenPromises: [],

  install(Vue) {
    Vue.prototype.$dataProvider = this;
  },
  apiInstance() {
    // Use the real apiClient
    if (has(window, "ProcessMaker.apiClient") && !window.ProcessMaker.isStub) {
      return window.ProcessMaker.apiClient;
    }

    // Allow standalone app to use a real api if token and baseURL are present
    if (this.token()) {
      axios.defaults.baseURL = this.baseURL();
      axios.defaults.headers.common = {
        Authorization: `Bearer ${this.token()}`
      };
      axios.defaults.adapter = cacheAdapterEnhancer(axios.defaults.adapter, {
        enabledByDefault: window.ProcessMaker.screen.cacheEnabled,
        cacheFlag: "useCache",
        defaultCache: new LRUCache({
          ttl: window.ProcessMaker.screen.cacheTimeout,
          max: 100
        })
      });
      return axios;
    }

    // If the apiClient is a stub, use it for running tests
    if (has(window, "ProcessMaker.apiClient") && window.ProcessMaker.isStub) {
      return window.ProcessMaker.apiClient;
    }

    // For anything else, use a dummy api client
    return {
      get() {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      }
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
    return localStorage.getItem("token");
  },
  baseURL() {
    return localStorage.getItem("baseURL");
  },

  // Methods below are used in the components

  getTasks(params) {
    const endpoint = get(
      window,
      "PM4ConfigOverrides.getTasksEndpoint",
      "/tasks"
    );
    return this.get(endpoint + params).then((response) => {
      if (response.data.screen && response.data.screen.nested) {
        this.addNestedScreenCache(response.data.screen.nested);
      }
      return response;
    });
  },
  addNestedScreenCache(nested) {
    nested.forEach((screen) => {
      if (screen.screen_id) {
        // It's from a screen version, so reference it by it's parent id
        screen.id = screen.screen_id;
      }
      const index = this.screensCache.findIndex((s) => s.id === screen.id);
      if (index > -1) {
        this.screensCache.splice(index, 1, screen);
      } else {
        this.screensCache.push(screen);
      }
    });
  },
  getScreen(id, query = "") {
    if (!id) {
      return null;
    }

    const cachedPromise = this.cachedScreenPromises.find(
      (item) => item.id === id && item.query === query
    );
    if (cachedPromise) {
      return cachedPromise.screenPromise;
    }

    const endpoint = get(
      window,
      "PM4ConfigOverrides.getScreenEndpoint",
      "/screens"
    );

    const screensCacheHit = this.screensCache.find(
      (screen) => screen.id === id
    );
    if (screensCacheHit) {
      return Promise.resolve({ data: screensCacheHit });
    }

    const screenPromise = new Promise((resolve, reject) => {
      this.get(`${endpoint}/${id}${query}`)
        .then((response) => {
          if (response.data.nested) {
            this.addNestedScreenCache(response.data.nested);
          }
          resolve(response);
        })
        .catch((response) => reject(response));
    });
    this.cachedScreenPromises.push({ id, query, screenPromise });
    return screenPromise;
  },

  flushScreenCache() {
    this.cachedScreenPromises.splice(0, this.cachedScreenPromises.length);
  },

  postScript(id, params, options = {}) {
    const endpoint = get(
      window,
      "PM4ConfigOverrides.postScriptEndpoint",
      "/scripts/execute/{id}"
    );

    return this.post(
      endpoint.replace("{id}", id) + this.authQueryString(),
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

    return this.post(url, params, { timeout: 0 });
  },

  /**
   * Gets data source service
   * @param {number|null} dataSourceId
   * @param {object} params
   * @returns {object}
   */
  getDataSource(dataSourceId, params) {
    // keep backwards compatibility
    if (
      !window.ProcessMaker.screen.cacheEnabled &&
      !window.ProcessMaker.screen.cacheTimeout
    ) {
      return this.postDataSource(dataSourceId, null, params);
    }
    let url = `/requests/data_sources/${dataSourceId}/resources/${params.config.endpoint}/data`;
    url += this.authQueryString();
    return this.get(url, {
      useCache: window.ProcessMaker.screen.cacheEnabled,
      params: {
        pmds_config: JSON.stringify(params.config),
        pmds_data: JSON.stringify(params.data)
      }
    }).then((response) => {
      return response;
    });
  },

  authQueryString() {
    const authParams = get(window, "PM4ConfigOverrides.authParams", null);

    let query = "";
    if (authParams) {
      query = `?${new URLSearchParams(authParams).toString()}`;
    }

    return query;
  },

  deleteFile(id, token = null) {
    let url = `files/${id}`;

    const queryParams = {
      token
    };

    const taskId = get(window, '_current_task_id', 0);

    if (taskId) {
      queryParams.task_id = taskId;
    }

    return this.delete(url, { params: queryParams });
  },

  download(url) {
    return this.apiInstance().get(url, { responseType: "blob" });
  },

  getCollections() {
    return this.get("/collections?per_page=1000").catch((error) => {
      if (error.response && error.response.status === 404) {
        throw new Error(i18next.t("Collections package not installed"));
      }
      throw error;
    });
  },

  getCollectionFields(collectionId) {
    return this.get(`/collections/${collectionId}/columns?per_page=1000`).catch(
      (error) => {
        if (error.response && error.response.status === 404) {
          throw new Error(i18next.t("Collection id not found"));
        }
        throw error;
      }
    );
  },

  getCollectionRecords(collectionId, options, nonce = null) {
    options.useCache = window.ProcessMaker.screen.cacheEnabled;

    return this.get(
      `/collections/${collectionId}/records${this.authQueryString()}`,
      options
    )
      .then((response) => {
        const data = response ? response.data : null;
        if (!data) {
          throw new Error(i18next.t("No data returned"));
        }
        return [data, nonce];
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          const data = { data: [] };
          return [data, nonce];
        }
        throw error;
      });
  }
};
