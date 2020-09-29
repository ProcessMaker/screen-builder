<template>
  <div id="tab-form" role="tabpanel" aria-labelledby="tab-form" class="tab-pane active show h-100">
    <template v-if="screen">
      <div class="card card-body border-top-0 h-100">
        <div v-if="renderComponent === 'task-screen'">
          <vue-form-renderer
            ref="renderer"
            v-model="requestData" 
            :config="screen.config" 
            :computed="screen.computed" 
            :custom-css="screen.customCss" 
            :watchers="screen.watchers" 
            @update="onUpdate" 
            @submit="submit" 
          />
        </div>
        <div v-else>
          <component
            :is="renderComponent"
            :process-id="task.process_id"
            :instance-id="task.process_request_id"
            :token-id="task.id"
            :screen="screen.config"
            :csrf-token="csrf_token"
            :computed="screen.computed"
            :custom-css="screen.custom_css"
            :watchers="screen.watchers"
            :data="requestData"
          />
        </div>
      </div>
      <div v-if="shouldAddSubmitButton" class="card-footer">
        <button type="button" class="btn btn-primary" @click="submit">{{ $t('Complete Task') }}</button>
      </div>
    </template>
    <template v-if="showTaskIsCompleted">
        <div class="card card-body text-center" v-cloak>
          <h1>{{ $t('Task Completed') }} <i class="fas fa-clipboard-check"/></h1>
        </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import DataProvider from '../DataProvider';
import _ from 'lodash';

Vue.use(DataProvider);

export default {
  props: {
    taskId:     { type: Number, default: null },
    csrf_token: { type: String, default: null },
    data:       { type: Object, default: () => { {} } },
  },
  data() {
    return {
      task: null,
      request: null,
      screen: null,
      disabled: false,
      socketListeners: [],
      requestData: {},
      renderComponent: 'task-screen',
      reloadInProgress: false,
      hasErrors: false,
    };
  },
  watch: {
    taskId(newId, oldId) {
      if (newId) {
        if (newId !== oldId) {
          this.loadTask(newId);
        }
      } else {
        this.task = null;
      }
    },
    data() {
      // requestData takes precedence over passed-in data
      this.requestData = Object.assign({}, this.data, this.requestData);
    },
    requestData() {
      this.$emit('input', this.requestData);
    }
  },
  computed: {
    shouldAddSubmitButton() {
      if (!this.task) { return false; }
      return this.task.bpmn_tag_name === 'manualTask' || !this.task.screen;
    },
    showTaskIsCompleted() {
      return this.task && this.task.advanceStatus === 'completed' && !this.screen;
    },
  },
  methods: {
    reload() {
      if (this.reloadInProgress) { return; }
      this.reloadInProgress = true;
      this.loadTask(this.task.id).finally(() => {
        this.reloadInProgress = false;
      });
    },
    loadTask(id) {
      return this.$dataProvider.getTasks(`/${id}?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition`)
        .then((response) => {
          this.task = response.data;
          this.prepareTask();
        });
    },
    prepareTask() {
      this.resetScreenState();
      const data = _.get(this.task, 'request_data', {});
      this.requestData = Object.assign({}, this.data, data);
      this.initSocketListeners();

      // sets breadcrumbs, etc.
      this.$emit('task-updated', this.task);
      if (this.task.process_request.status === 'ERROR') {
        this.hasErrors = true;
      } else {
        this.hasErrors = false;
      }

      this.statusCard = this.classHeaderCard(this.task.advanceStatus);
      this.checkTaskStatus();
    },
    resetScreenState() {
      if (this.$refs.renderer && this.$refs.renderer.$children[0]) {
        this.$refs.renderer.$children[0].currentPage = 0;
      }
    },
    checkTaskStatus() {
      if (this.task.status == 'COMPLETED' || this.task.status == 'CLOSED' || this.task.status == 'TRIGGERED') {
        this.closeTask();
      } else {
        this.screen = this.task.screen;
        this.renderComponent = this.task.component;
      }
    },
    closeTask() {
      if (this.hasErrors) {
        this.$emit('error', this.task.process_request_id);
        return;
      }
      if (!this.task.allow_interstitial) {
        this.$emit('closed', this.task.id);
        this.screen = null;
      } else {
        this.screen = this.task.interstitial_screen;
        this.loadNextAssignedTask();
      }
    },
    loadNextAssignedTask() {
      return this.$dataProvider.getTasks(`?user_id=${this.task.user_id}&status=ACTIVE&process_request_id=${this.task.process_request_id}`).then((response) => {
        if (response.data.data.length > 0) {
          const firstNextAssignedTask = response.data.data[0].id;
          this.loadTask(firstNextAssignedTask);
        }
      });
    },
    classHeaderCard(status) {
      let header = 'bg-success';
      switch (status) {
        case 'completed':
          header = 'bg-secondary';
          break;
        case 'overdue':
          header = 'bg-danger';
          break;
      }
      return 'card-header text-capitalize text-white ' + header;
    },
    submit() {
      //single click
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      this.$emit('submit', this.task);
      this.$nextTick(() => {
        this.disabled = false;
      });
      
      if (this.task.allow_interstitial) {
        this.screen = this.task.interstitial_screen;
      } else {
        this.interstitial = null;
      }

    },
    onUpdate(data) {
      window.ProcessMaker.EventBus.$emit('form-data-updated', data);
    },
    
    activityAssigned() {
      // This may no longer be needed
    },
    processCompleted() {
      this.$emit('completed', this.task.process_request_id);
    },
    processUpdated(data) {
      if (data.event === 'ACTIVITY_COMPLETED' || data.event === 'ACTIVITY_ACTIVATED') {
        this.reload();
      }
    },
    initSocketListeners() {
      if (this.socketListeners.length > 0) {
        return;
      }
      
      this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.task.process_request_id}`, '.ProcessCompleted', (data) => {
        this.processCompleted(data);
      });

      this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.task.process_request_id}`, '.ProcessUpdated', (data) => {
        this.processUpdated(data);
      });
    },
    addSocketListener(channel, event, callback) {
      this.socketListeners.push({
        channel,
        event,
      });
      window.Echo.private(channel).listen(
        event,
        callback
      );
    },
    unsubscribeSocketListeners() {
      this.socketListeners.forEach((element) => {
        window.Echo.private(element.channel).stopListening(element.event);
      });
      this.socketListeners = [];
    },
    obtainPayload(url) {
      return new Promise((resolve) => {
        window.ProcessMaker.apiClient
          .get(url)
          .then(response => {
            resolve(response.data);
          }).catch(() => {
            // User does not have access to the resource. Ignore.
          });
      });
    },
  },
  mounted() {
    this.requestData = this.data;
    if (this.taskId) {
      this.loadTask(this.taskId);
    }
  },
  destroyed() {
    this.unsubscribeSocketListeners();
  },
};
</script>