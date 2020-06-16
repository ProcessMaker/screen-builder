import Mustache from 'mustache';

export default {
  data() {
    return {
      listeners: [],
      echoListeners: [],
    };
  },
  methods: {
    queueWatcher(watcher) {
      return new Promise(complete => {
        const input = Mustache.render(watcher.input_data, this.vdata);
        const config = Mustache.render(watcher.script_configuration, this.vdata);
        this.listenWatcher(watcher).then((response) => {
          complete(response);
        });
        window.ProcessMaker.apiClient.post(`/scripts/execute/${watcher.script_id}`, {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }).then((response) => {
        this.setValue(watcher.output_variable, response);
        return response;
      });
    },
    listenWatcher(watcher) {
      return new Promise((resolve, exception) => {
        this.listeners.push({ watcher, resolve, exception });
      });
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
    loadWatcherResponse(watcherUid, response) {
      window.ProcessMaker.apiClient.get(`/scripts/execution/${response.key}`).then((result) => {
        const response = result.data;
        this.listeners.forEach(({watcher, resolve, exception}) => {
          if (watcher.uid === watcherUid) {
            if (response.exception) {
              exception(response.message);
            } else {
              resolve(response);
            }
          }
        });
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
  },
  destroyed() {
    this.cleanEchoListeners();
  },
};