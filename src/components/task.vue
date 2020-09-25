<template>
  <div id="tab-form" role="tabpanel" aria-labelledby="tab-form" class="tab-pane active show h-100">
    <template v-if="shouldShowScreen">
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
    <template v-if="taskIsCompleted">
      <div class="card card-body border-top-0 h-100">
        <vue-form-renderer
          ref="renderer"
          v-if="interstitial"
          v-model="requestData" 
          :config="interstitial.config"
          :computed="interstitial.computed" 
          :custom-css="interstitial.customCss" 
          :watchers="interstitial.watchers" 
        />
        <div v-else class="card card-body text-center" v-cloak>
          <h1>{{ $t('Task Completed') }} <i class="fas fa-clipboard-check"/></h1>
        </div>
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
  // This component can take a taskId OR a screenId (with optional interstitial)
  // If the taskId is provided, the screen and interstitial are derived from the task
  props: ['taskId', 'csrf_token', 'screenId', 'screenInterstitialId', 'data', 'newRequest'],
  data() {
    return {
      task: null,
      disabled: false,
      socketListeners: [],
      screen: null,
      interstitial: null,
      requestData: {},
      renderComponent: 'task-screen',
      reloadInProgress: false,
    };
  },
  watch: {
    taskId() {
      if (this.taskId) {
        this.loadTask(this.taskId);
      } else {
        this.task = null;
      }
    },
    screenId() {
      if (this.taskId) {
        this.loadScreen();
      } else {
        this.screen = null;
      }
    },
    newRequest() {
      this.initSocketListeners();
      if (this.newRequest.status === 'ACTIVE') {
        this.loadNextAssignedTask();
      }
    },
    screenInterstitialId() {
      if (this.screenInterstitialId) {
        this.loadInterstitialScreen();
      } else {
        this.interstitial = null;
      }
    },
    data() {
      // requestData takes precedence over passed-in data
      this.requestData = Object.assign({}, this.data, this.requestData);
    },
  },
  computed: {
    shouldShowScreen() {
      if (this.taskIsCompleted) {
        return false;
      }

      if (this.screen && !this.task) {
        // Start Event
        return true;
      }

      if (this.screen && this.taskIsOpenOrOverdue) {
        // Regular Task
        return true;
      }
      
      return false;
    },
    shouldAddSubmitButton() {
      if (!this.task) { return false; }
      return this.task.bpmn_tag_name === 'manualTask' || !this.task.screen;
    },
    taskIsCompleted() {
      if (this.task) {
        return this.task.advanceStatus === 'completed' || this.task.advanceStatus === 'triggered';
      } else if (this.newRequest) {
        return true;
      }
      return false;
    },
    taskIsOpenOrOverdue() {
      if (!this.task) { return false; }
      return this.task.advanceStatus === 'open' || this.task.advanceStatus === 'overdue';
    },
    requestId() {
      if (this.task) {
        return this.task.process_request_id;
      }

      if (this.newRequest) {
        return this.newRequest.id;
      }

      return null;
    },
    userId() {
      if (this.task) {
        return this.task.user_id;
      }

      if (this.newRequest) {
        return this.newRequest.user_id;
      }

      return null
    }
  },
  methods: {
    activityAssigned() {
      // This may no longer be needed
    },
    reload() {
      if (this.reloadInProgress) { return; }
      this.reloadInProgress = true;
      if (!this.task) { 
        this.loadNextAssignedTask().finally(() => {
          this.reloadInProgress = false;
        });
        return;
      }
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
    loadScreen() {
      this.loadScreenById(this.screenId).then(response => {
        this.screen = response.data;
      });
    },
    loadInterstitialScreen() {
      this.loadScreenById(this.screenInterstitialId).then(response => {
        this.interstitial = response.data;
      });
    },
    loadScreenById(id)
    {
      return this.$dataProvider.getScreen(id);
    },
    resetScreenState() {
      if (this.$refs.renderer && this.$refs.renderer.$children[0]) {
        this.$refs.renderer.$children[0].currentPage = 0;
      }
    },
    redirectWhenProcessCompleted() {
      this.$emit('completed', this.task.process_request_id);
    },
    refreshWhenProcessUpdated(data) {
      if (data.event === 'ACTIVITY_COMPLETED' || data.event === 'ACTIVITY_ACTIVATED') {
        this.reload();
      }
    },
    checkTaskStatus() {
      if (this.task.status == 'COMPLETED' || this.task.status == 'CLOSED' || this.task.status == 'TRIGGERED') {
        this.closeTask();
      }
    },
    closeTask() {
      if (this.hasErrors) {
        this.$emit('error', this.task.process_request_id);
        return;
      }
      if (!this.interstitial) {
        this.$emit('closed', this.task.id);
      } else {
        this.loadNextAssignedTask();
      }
    },
    loadNextAssignedTask() {
      return this.$dataProvider.getTasks(`?user_id=${this.userId}&status=ACTIVE&process_request_id=${this.requestId}`).then((response) => {
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
    prepareTask() {
      this.resetScreenState();
      const data = _.get(this.task, 'request_data', {});
      this.requestData = Object.assign({}, this.data, data);
      this.initSocketListeners();
      this.screen = this.task.screen;
      this.renderComponent = this.task.component;

      if (this.task.allow_interstitial) {
        this.interstitial = this.task.interstitial_screen;
      } else {
        this.interstitial = null;
      }

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
    },
    onUpdate(data) {
      window.ProcessMaker.EventBus.$emit('form-data-updated', data);
    },
    initSocketListeners() {
      this.unsubscribeSocketListeners();

      this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.requestId}`, '.ActivityAssigned', () => {
        this.activityAssigned();
      });

      this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.requestId}`, '.ProcessCompleted', () => {
        this.redirectWhenProcessCompleted();
      });

      this.addSocketListener(`ProcessMaker.Models.ProcessRequest.${this.requestId}`, '.ProcessUpdated', (data) => {
        this.refreshWhenProcessUpdated(data);
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
    } else if (this.screenId) {
      this.loadScreen();
      if (this.screenInterstitialId) {
        this.loadInterstitialScreen();
      }
    }
  },
  destroyed() {
    this.unsubscribeSocketListeners();
  },
};
</script>