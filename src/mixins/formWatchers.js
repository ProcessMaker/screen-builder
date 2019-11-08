import Mustache from 'mustache';

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
      const trigger = this.watching[watcher.watching] == data[watcher.watching];
      if (trigger) {
        this.triggerWatcher(watcher, data);
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
        window.ProcessMaker.api.post(this.watchers_config.api.execute.replace(/script_id/, watcher.script_id), {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }
    },
    loadWatcherResponse(watcherUid, response) {
      const watcher = this.watchers.find(watcher => watcher.uid = watcherUid);
      if (watcher) {
        this.transientData[watcher.output] = response;
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
      const event = 'ProcessMaker.Events.ScriptExecution';
      this.addEchoListener(channel, event, (data) => {
        this.loadWatcherResponse(data.watcher, data.response);
      });
    }
  },
  destroyed() {
    this.cleanEchoListeners();
  },
};
