import Mustache from 'mustache';

const broadcastEvent = '.Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated';

const debounce_time = 1000;

export default {
  data() {
    return {
      listeners: [],
      echoListeners: [],
      debounce: {},
    };
  },
  methods: {
    queueWatcher(watcher) {
      if (this.debounce[watcher.uid]) {
        clearTimeout(this.debounce[watcher.uid]);
      }
      this.debounce[watcher.uid] = setTimeout(() => {
        this.debounce[watcher.uid] = null;
        this.queueWatcherSync(watcher);
      }, debounce_time);
    },
    queueWatcherSync(watcher) {
      //add a random sufix to uniquely identify this watcher call
      watcher.uid = watcher.uid + (Math.random().toString(36)+'00000000000000000').slice(2, 16) + Date.now();

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
        
        let scriptId = watcher.script_id;
        if (watcher.script_key) {
          scriptId = watcher.script_key;
        }
        this.$dataProvider.postScript(scriptId, {
          watcher: watcher.uid,
          data: input,
          config,
        });
      }).then((response) => {
        if (watcher.output_variable) {
          this.setValue(watcher.output_variable, response);
        }

        //update mapped values
        let watcherConf = JSON.parse (watcher.script_configuration);
        let mapping = watcherConf.dataMapping || [];

        mapping.forEach(map => {
          if (typeof this.getValue(`${map.key}_was_filled__`) !== 'undefined') {
            // If the variable already exist it must be set as filled and updated
            this.setValue(`${map.key}_was_filled__`, true);
            this.setValue(map.key, response[map.key]);
          }
          else {
            // If it is a new variable, the value  is set directly
            this.$set(this.vdata, map.key, response[map.key]);
          }
        }, this);

        // hide watcher's popup
        if (this.$parent.$refs.watchersSynchronous) {
          this.$parent.$refs.watchersSynchronous.hide(watcher.name);
        }
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
    if (window.ProcessMaker && window.ProcessMaker.user) {
      const channel = `ProcessMaker.Models.User.${window.ProcessMaker.user.id}`;
      const event = '.ProcessMaker\\Events\\ScriptResponseEvent';
      this.echoListeners.push({
        event,
        channel,
        broadcastEvent,
      });
      window.Echo.private(channel).listen(
        event,
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