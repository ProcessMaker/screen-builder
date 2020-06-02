import Mustache from 'mustache';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

const globalObject = typeof window === 'undefined'
  ? global
  : window;

export default {
  data() {
    return {
      watcherObservers: [],
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
    watchDataChanges(data) {
      return new Promise(complete => {
        if (this.watchers && this.watchers instanceof Array) {
          let checked = 0;
          this.watchers.forEach(watcher =>  {
            checked++;
            this.checkWatcher(watcher, data).then(() => {
              checked--;
              if (checked === 0) {
                complete();
              }
            });
          });
        }
      });
    },
    /**
     * Check and trigger a watcher if it matches the condition
     *
     * @param {object} watcher
     * @param {object} data
     */
    checkWatcher(watcher, data) {
      return new Promise(complete => {
        const value = get(data, watcher.watching);
        if (!isEqual(this.watching[watcher.watching], value)) {
          this.queueWatcher(watcher, data).then(() => {
            complete();
          });
        }
        if (value !== undefined) {
          this.watching[watcher.watching] = JSON.parse(JSON.stringify(value));
        }
      });
    },
    /**
     * Queue a watcher
     * @param {object} watcher
     * @param {object} data
     */
    queueWatcher(watcher, data) {
      return new Promise(complete => {
        this.watchersQueue.indexOf(watcher) === -1 ? this.watchersQueue.push(watcher) : null;
        this.processWatchersQueue(data).then(() => {
          complete();
        });
      });
    },
    /**
     * Process the watchers queue
     * @param {object} data
     */
    processWatchersQueue(data) {
      return new Promise(complete => {
        let count = this.watchersQueue.length;
        while (this.watchersQueue.length) {
          const watcher = this.watchersQueue.shift();
          this.callWatcher(watcher, data).then(() => {
            count--;
            if (count === 0) {
              complete();
            }
          });
        }
      });
    },
    /**
     * Call a watcher
     *
     * @param {object} watcher
     * @param {object} data
     */
    callWatcher(watcher, data) {
      return new Promise(complete => {
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

          this.listenWatcher(watcher.uid).then(() => {
            complete();
          });
        }
      });
    },
    listenWatcher(watcherUid) {
      return new Promise(complete => {
        this.watcherObservers.push({ watcherUid, complete });
      });
    },
    notifyWatcherObserver(watcherUid, result) {
      this.watcherObservers.filter(w => w.watcherUid === watcherUid)
        .forEach(observer => {
          observer.complete(result);
        });
    },
    loadWatcherResponse(watcherUid, response) {
      if (!this.watchers)  {
        return;
      }
      const watcher = this.watchers.find(watcher => watcher.uid === watcherUid);
      return new Promise((resolve, exception) => {
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
        this.notifyWatcherObserver(watcherUid, { response });
      }).catch(error => {
        if (watcher.synchronous) {
          if (this.$el.offsetParent) {
            this.$refs.watchersSynchronous.error(error);
          }
        } else {
          globalObject.ProcessMaker.alert(error, 'danger');
        }
        this.notifyWatcherObserver(watcherUid, { error });
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
  },
  destroyed() {
    this.cleanEchoListeners();
  },
};
