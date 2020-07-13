/* istanbul ignore file */
import Mustache from 'mustache';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

const globalObject = typeof window === 'undefined'
  ? global
  : window;

export default {
  data() {
    return {
      watchersQueue: [],
      watchers_config: {
        api: {
          execute: null,
          execution: null,
        },
      },
      watching: {},
      echoListeners: [],
    };
  },
  methods: {
    /**
     * Watch data changes
     * @param {object} data
     * @param {array} changes
     */
    watchDataChanges(data, changes) {
      if (this.watchers && this.watchers instanceof Array) {
        this.watchers.forEach(watcher =>  {
          if (changes.indexOf(watcher.watching) !== -1) {
            this.checkWatcher(watcher, data);
          }
        });
      }
    },
    /**
     * Check and trigger a watcher if it matches the condition
     *
     * @param {object} watcher
     * @param {object} data
     */
    checkWatcher(watcher, data) {
      if (!isEqual(this.watching[watcher.watching], get(data, watcher.watching))) {
        this.queueWatcher(watcher, data);
      }
      this.watching[watcher.watching] = JSON.parse(JSON.stringify(get(data, watcher.watching)));
    },
    /**
     * Queue a watcher
     * @param {object} watcher
     * @param {object} data
     */
    queueWatcher(watcher, data) {
      this.watchersQueue.indexOf(watcher) === -1 ? this.watchersQueue.push(watcher) : null;
      this.processWatchersQueue(data);
    },
    /**
     * Process the watchers queue
     * @param {object} data
     */
    processWatchersQueue(data) {
      while (this.watchersQueue.length) {
        const watcher = this.watchersQueue.shift();
        this.callWatcher(watcher, data);
      }
    },
    /**
     * Call a watcher
     *
     * @param {object} watcher
     * @param {object} data
     */
    callWatcher(watcher, data) {
      if (this.watchers_config.api.execute) {
        const scriptId = watcher.script_key || watcher.script_id;
        if (!scriptId) {
          globalObject.ProcessMaker.alert(this.$t('Script not found for the Watcher'), 'warning');
          return;
        }

        const input = Mustache.render(watcher.input_data, data);
        const config = Mustache.render(watcher.script_configuration, data);
        if (watcher.synchronous) {
          // popup lock screen
          if (this.$el.offsetParent) {
            this.$refs.watchersSynchronous.show(watcher.name);
          }
        }

        globalObject.window.ProcessMaker.apiClient.post(this.watchers_config.api.execute.replace(/script_id\/script_key/, scriptId), {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }
    },
    loadWatcherResponse(watcherUid, response) {
      if (!this.watchers)  {
        return;
      }
      const watcher = this.watchers.find(watcher => watcher.uid === watcherUid);
      new Promise((resolve, exception) => {
        if (response.exception) {
          exception(response.message);
        } else if (watcher) {
          if (response.key) {
            globalObject.window.ProcessMaker.apiClient.get(this.watchers_config.api.execution.replace(/execution_key/, response.key)).then((result) => {
              const response = result.data;
              if (response.exception) {
                exception(response.message);
              } else {
                resolve({response});
              }
            });
          } else {
            resolve({response});
          }
        }
      }).then(({response}) => {
        this.$set(this.transientData, watcher.output_variable, response.output);
        this.$refs.watchersSynchronous.hide(watcher.name);
      }).catch(error => {
        if (watcher.synchronous) {
          if (this.$el.offsetParent) {
            this.$refs.watchersSynchronous.error(error);
          }
        } else {
          globalObject.ProcessMaker.alert(error, 'danger');
        }
      });
    },
    /**
     * Add a Echo listener
     * @param {string} channel
     * @param {string} event
     * @param {function} callback
     */
    addEchoListener(channel, event, callback) {
      this.echoListeners.push({
        channel,
        event,
      });
      globalObject.window.Echo.private(channel).listen(
        event,
        callback,
      );
    },
    /**
     * Clean the registered echo listeners
     */
    cleanEchoListeners() {
      this.echoListeners.forEach(element => {
        globalObject.window.Echo.private(
          element.channel
        ).stopListening(element.event);
      });
    },
  },
  mounted() {
    if (globalObject.window.ProcessMaker && globalObject.window.ProcessMaker.user) {
      const channel = `ProcessMaker.Models.User.${globalObject.window.ProcessMaker.user.id}`;
      const event = 'ProcessMaker\\Notifications\\ScriptResponseNotification';
      globalObject.window.Echo.private(channel).notification(
        (data) => {
          if (data.type === event) {
            this.loadWatcherResponse(data.watcher, data.response);
          }
        },
      );
    }
    this.processWatchersQueue = debounce(this.processWatchersQueue, 1000);
  },
  destroyed() {
    this.cleanEchoListeners();
  },
};
