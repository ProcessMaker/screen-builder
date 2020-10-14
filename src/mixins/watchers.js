import Mustache from 'mustache';
import { debounce } from 'lodash';

const broadcastEvent = '.Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated';

export default {
  data() {
    return {
      listeners: [],
      echoListeners: [],
    };
  },
  methods: {
    queueWatcherSync(watcher) {
      if (watcher.synchronous) {
        // lock screen with watcher's popup
        if (this.$el.offsetParent) {
          this.$parent.$refs.watchersSynchronous.show(watcher.name);
        }
      }
      return new Promise((complete, exception) => {
        const input = Mustache.render(watcher.input_data, this.vdata);
        const config = Mustache.render(watcher.script_configuration, this.vdata);
        this.listenWatcher(watcher).then((response) => complete(response))
          .catch(error => exception(error));
        const scriptId = watcher.script_key || watcher.script_id;
        this.$dataProvider.postScript(scriptId, {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }).then((response) => {
        this.setValue(watcher.output_variable, response);
        // hide watcher's popup
        this.$parent.$refs.watchersSynchronous.hide(watcher.name);
        return response;
      }).catch(error => {
        if (watcher.synchronous) {
          this.$parent.$refs.watchersSynchronous.error(error);
        } else {
          window.ProcessMaker.alert(error, 'danger');
        }
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
      this.echoListeners.splice(0);
    },
    loadWatcherResponse(watcherUid, response) {
      window.ProcessMaker.apiClient.get(`/scripts/execution/${response.key}`).then((result) => {
        const response = result.data;
        this.listeners.forEach(({watcher, resolve, exception}) => {
          if (watcher.uid === watcherUid) {
            if (response.exception) {
              exception(response.message);
            } else {
              resolve(response.output);
            }
          }
        });
      }).catch((error) => {
        this.$parent.$refs.watchersSynchronous.error(error);
      });
    },
  },
  mounted() {
    this.queueWatcher = debounce(this.queueWatcherSync, window.ProcessMaker.watchersDebounce || 1000);
    if (window.ProcessMaker && window.ProcessMaker.user) {
      const channel = `ProcessMaker.Models.User.${window.ProcessMaker.user.id}`;
      const event = 'ProcessMaker\\Notifications\\ScriptResponseNotification';
      this.echoListeners.push({
        event,
        channel,
        broadcastEvent,
      });
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