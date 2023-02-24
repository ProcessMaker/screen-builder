import Mustache from 'mustache';
import _ from 'lodash';

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
      if (watcher.synchronous) {
        // lock screen with watcher's popup
        if (this.$el.offsetParent) {
          this.$parent.$refs.watchersSynchronous.show(watcher.name);
        }
      }
      else {
        if (watcher.show_async_loading) {
          this.$emit('asyncWatcherTriggered');
        }
      }
      return new Promise((complete, exception) => {
        const input = Mustache.render(watcher.input_data, this.vdata);
        const config = Mustache.render(watcher.script_configuration, this.vdata);
        let scriptId = watcher.script_id;

        if (watcher.script_key) {
          // Data Source
          const requestId = _.get(this.vdata, '_request.id', null);
          const params = { config: JSON.parse(config), data: this.vdata };
          
          this.$dataProvider.postDataSource(scriptId, requestId, params).then(response => {
            this.$emit('asyncWatcherCompleted');
            complete(response.data);
          }).catch(err => {
            exception(err);
          });

        } else {
          // Script
          this.$dataProvider.postScript(scriptId, {
            watcher: watcher.uid,
            data: input,
            config,
            sync: true,
          }, { timeout: 0 }).then(response => {
            this.$emit('asyncWatcherCompleted');
            complete(response.data.output);
          }).catch(err => {
            exception(err);
          });
        }
      }).then((response) => {
        // If watcher has an output variable and is a script
        if (watcher.output_variable && (watcher.script_key || '').length === 0) {
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
        const message = _.get(error, 'response.data.message', error.message);
        if (watcher.synchronous) {
          this.$parent.$refs.watchersSynchronous.error(message);
        } else {
          window.ProcessMaker.alert(message, 'danger');
        }
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