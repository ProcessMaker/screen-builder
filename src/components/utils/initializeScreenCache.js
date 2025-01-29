import { cacheAdapterEnhancer } from "axios-extensions";
import { LRUCache } from "lru-cache";
/**
 * Initialize the axios cache adapter
 *
 * @param {Object} apiClient
 * @param {Object} screenConfig
 */
export function initializeScreenCache(apiClient, screenConfig) {
    apiClient.defaults.adapter = cacheAdapterEnhancer(
      apiClient.defaults.adapter,
      {
        enabledByDefault: window.ProcessMaker.screen.cacheEnabled,
        cacheFlag: "useCache",
        defaultCache: new LRUCache({
          ttl: window.ProcessMaker.screen.cacheTimeout,
          max: 100
        })
      }
    );
  }