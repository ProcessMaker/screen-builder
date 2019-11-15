import Mustache from 'mustache';
import _ from 'lodash';

export default {
  data() {
    return {
      watchers_config: {
        api: {
          execute: null,
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
     */
    watchDataChanges(data) {
      if (this.watchers && this.watchers instanceof Array) {
        this.watchers.forEach(watcher => this.checkWatcher(watcher, data));
      }
    },
    /**
     * Check and trigger a watcher if it matches the condition
     *
     * @param {object} watcher
     * @param {object} data
     */
    checkWatcher(watcher, data) {
      const trigger = _.get(this.watching, watcher.watching) != _.get(data, watcher.watching);
      if (trigger) {
        this.callWatcher(watcher, data);
      }
      this.watching[watcher.watching] = data[watcher.watching];
    },
    /**
     * Call a watcher
     *
     * @param {object} watcher
     * @param {object} data
     */
    callWatcher(watcher, data) {
      if (this.watchers_config.api.execute) {
        const input = Mustache.render(watcher.input_data, data);
        const config = Mustache.render(watcher.script_configuration, data);
        if (watcher.synchronous) {
          // popup lock screen
          this.$refs.watchersSynchronous.show(watcher.name);
        }
        window.ProcessMaker.apiClient.post(this.watchers_config.api.execute.replace(/script_id/, watcher.script_key || watcher.script_id ), {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }
    },
    loadWatcherResponse(watcherUid, response) {
      const watcher = this.watchers.find(watcher => watcher.uid = watcherUid);
      if (response.exception) {
        // change to error popup
        this.$refs.watchersSynchronous.error();
      } else if (watcher) {
        this.$set(this.transientData, watcher.output_variable, response.output);
        // unlock screen
        this.$refs.watchersSynchronous.hide();
      }
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
      window.Echo.private(channel).listen(
        event,
        callback,
      );
    },
    /**
     * Clean the registered echo listeners
     */
    cleanEchoListeners() {
      this.echoListeners.forEach(element => {
        window.Echo.private(
          element.channel
        ).stopListening(element.event);
      });
    },
  },
  mounted() {
    if (window.ProcessMaker && window.ProcessMaker.user) {
      const channel = `ProcessMaker.Models.User.${window.ProcessMaker.user.id}`;
      const event = 'ProcessMaker\\Notifications\\ScriptResponseNotification';
      window.Echo.private(channel).notification(
        (data) => {
          if (data.type === event) {
            this.loadWatcherResponse(data.watcher, data.response);
          }
        },
      );
    }
    this.callWatcher = _.debounce(this.callWatcher, 1000);
  },
  destroyed() {
    this.cleanEchoListeners();
  },
};
