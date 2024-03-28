<template>
  <div
    id="tab-form"
    role="tabpanel"
    aria-labelledby="tab-form"
    class="tab-pane active show h-100"
  >
    <template v-if="screen">
      <b-overlay
          :show="disabled"
          id="overlay-background"
          variant="white"
          cardStyles="pointer-events: none;pointer-events: none;inset: 1px"
          rounded="sm"
      >
      <template #overlay>
        <div class="text-center">
          <p>Please claim this task to continue.</p>
        </div>
      </template>
      <div class="card card-body border-top-0 h-100" :class="screenTypeClass">
        <div v-if="renderComponent === 'task-screen'">
          <vue-form-renderer
            ref="renderer"
            v-model="requestData"
            :config="screen.config"
            :computed="screen.computed"
            :custom-css="screen.custom_css"
            :watchers="screen.watchers"
            :key="refreshScreen"
            :loop-context="loopContext"
            @update="onUpdate"
            @submit="submit"
          />
        </div>
        <div v-else>
          <component
            :is="renderComponent"
            :process-id="processId"
            :instance-id="requestId"
            :token-id="taskId"
            :screen="screen.config"
            :csrf-token="csrfToken"
            :computed="screen.computed"
            :custom-css="screen.custom_css"
            :watchers="screen.watchers"
            :data="requestData"
            :type="screen.type"
            @submit="submit"
          />
        </div>
      </div>
      <div v-if="shouldAddSubmitButton" class="card-footer">
        <button type="button" class="btn btn-primary" @click="submit(null)">
          {{ $t('Complete Task') }}
        </button>
      </div>
      </b-overlay>
    </template>
    <template v-if="showTaskIsCompleted">
      <div class="card card-body text-center" v-cloak>
        <h1>
          {{ $t('Task Completed') }}
          <i class="fas fa-clipboard-check" />
        </h1>
      </div>
    </template>
  </div>
</template>

<script>
import VueFormRenderer from './vue-form-renderer.vue';
import _ from 'lodash';
import simpleErrorMessage from './SimpleErrorMessage.vue';

const defaultBeforeLoadTask = () => {
  return new Promise((resolve) => {
    resolve();
  });
};

export default {
  components:{
    simpleErrorMessage,
    VueFormRenderer
  },
  props: {
    initialTaskId: { type: Number, default: null },
    initialScreenId: { type: Number, default: null },
    initialRequestId: { type: Number, default: null },
    initialProcessId: { type: Number, default: null },
    initialNodeId: { type: String, default: null },
    userId: { type: Number, default: null },
    csrfToken: { type: String, default: null },
    value: { type: Object, default: () => {} },
    beforeLoadTask: { type: Function, default: defaultBeforeLoadTask },
    initialLoopContext: { type: String, default: "" },
    taskPreview: { type: Boolean, default: false },
    loading: { type: Number, default: null },
    alwaysAllowEditing: { type: Boolean, default: false },
    disableInterstitial: { type: Boolean, default: false },
  },
  data() {
    return {
      task: null,
      taskId: null,
      request: null,
      requestId: null,
      screen: null,
      screenId: null,
      renderComponent: 'task-screen',
      processId: null,
      nodeId: null,
      disabled: false,
      socketListeners: [],
      requestData: {},
      hasErrors: false,
      refreshScreen: 0,
      redirecting: null,
      loadingButton: false,
    };
  },
  watch: {
    initialScreenId: {
      handler() {
        this.screenId = this.initialScreenId;
      },
    },

    initialTaskId: {
      handler() {
        this.taskId = this.initialTaskId;
      },
    },

    initialRequestId: {
      handler() {
        this.requestId = this.initialRequestId;
      },
    },

    initialProcessId: {
      handler() {
        this.processId = this.initialProcessId;
      },
    },

    initialNodeId: {
      handler() {
        this.nodeId = this.initialNodeId;
      },
    },

    screenId: {
      handler() {
        if (this.screenId) {
          this.loadScreen(this.screenId);
        }
      },
    },

    taskId: {
      handler() {
        if (this.taskId) {
          if (!this.task || this.task.id !== this.taskId) {
            this.loadTask();
          }
        }
      },
    },

    requestId: {
      handler() {
        if (this.requestId) {
          this.setMetaValue();
          this.initSocketListeners();
        } else {
          this.unsubscribeSocketListeners();
        }
      },
    },

    task: {
      handler() {
        if (!this.screen) {
          // if no current screen show the interstitial screen if exists
          this.screen = this.task && this.task.interstitial_screen;
        }
        this.taskId = this.task.id;
        this.nodeId = this.task.element_id;
        this.listenForParentChanges();
        if (this.task.process_request.status === 'COMPLETED') {
          if (!this.taskPreview) {
            this.$emit('completed', this.task.process_request.id);
          }
        }
        if (this.taskPreview && this.task.status === "CLOSED") {
          this.task.interstitial_screen['_interstitial'] = false;
          if (!this.alwaysAllowEditing) {
            this.task.screen.config = this.disableForm(this.task.screen.config);
          }
          this.screen = this.task.screen;
        }
      }
    },

    value: {
      handler() {
        this.requestData = this.value;
      },
    },
    screen: {
      handler() {
        if (!this.screen) {
          return;
        }
        if (this.renderComponent === 'ConversationalForm') {
          return;
        }
        if (this.screen.type === 'CONVERSATIONAL') {
          this.renderComponent = 'ConversationalForm';
        } else {
          const isInterstitial = _.get(this.screen, '_interstitial', false);
          let component = _.get(this, 'task.component', 'task-screen');
          if (component === null || isInterstitial) {
            component = 'task-screen';
          }
          this.renderComponent = component;
        }
      }
    },
  },
  computed: {
    shouldAddSubmitButton() {
      if (!this.task) {
        return false;
      }
      return this.task.bpmn_tag_name === 'manualTask' || (!this.task.screen && this.task.element_type !== 'startEvent');
    },
    showTaskIsCompleted() {
      return (
        this.task && this.task.advanceStatus === 'completed' && !this.screen
      );
    },
    screenTypeClass() {
      if (!this.screen) {
        return;
      }
      const screenType = this.screen.type;
      return screenType.toLowerCase() + '-screen';
    },
    parentRequest() {
      return _.get(this.task, 'process_request.parent_request_id', null);
    },
  },
  methods: {
    disableForm(json) {
      if (json instanceof Array) {
        for (let item of json) {
          if (item.component==='FormButton' && item.config.event==='submit') {
            json.splice(json.indexOf(item), 1);
          } else {
            this.disableForm(item);
          }
        }
      }
      if (json.config !== undefined) {
        json.config.disabled = true;
      }
      if (json.items !== undefined) {
        this.disableForm(json.items);
      }
      return json;
    },
    showSimpleErrorMessage() {
      this.renderComponent = 'simpleErrorMessage';
    },
    loadScreen(id) {
      let query = '?include=nested';
      if (this.requestId) {
        query += '&request_id=' + this.requestId;
      }

      this.$dataProvider.getScreen(id, query).then((response) => {
        this.screen = response.data;
      });
    },
    reload() {
      if (this.taskId) {
        this.loadTask();
      } else {
        this.loadNextAssignedTask();
      }
    },
    loadTask() {
      const url = `/${this.taskId}?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission`;
      // For Vocabularies
      if (window.ProcessMaker && window.ProcessMaker.packages && window.ProcessMaker.packages.includes('package-vocabularies')) {
        window.ProcessMaker.VocabulariesSchemaUrl = `vocabularies/task_schema/${this.taskId}`;
      }

      return this.beforeLoadTask(this.taskId, this.nodeId).then(() => {
        this.$dataProvider
          .getTasks(url)
          .then((response) => {
            this.task = response.data;
            this.checkTaskStatus();
            if (
              window.PM4ConfigOverrides
              && window.PM4ConfigOverrides.getScreenEndpoint
              && window.PM4ConfigOverrides.getScreenEndpoint.includes('tasks/')
            ) {
              const screenPath = window.PM4ConfigOverrides.getScreenEndpoint.split('/');
              screenPath[1] = this.task.id;
              window.PM4ConfigOverrides.getScreenEndpoint = screenPath.join('/');
            }
          })
          .catch(() => {
            this.hasErrors = true;
          });
      });
    },
    prepareTask() {
      // If the immediate task status is completed and we are waiting with a loading button,
      // do not reset the screen because that would stop displaying the loading spinner
      // before the next task is ready.
      if (!this.loadingButton || this.task.status === 'ACTIVE') {
        this.resetScreenState();
        this.requestData = _.get(this.task, 'request_data', {});
        this.loopContext = _.get(this.task, "loop_context", "");

        if (this.task.draft) {
          this.requestData = _.merge(
            {},
            this.requestData,
            this.task.draft.data
          );
        }

        this.refreshScreen++;
      }

      this.$emit('task-updated', this.task);

      if (this.task.process_request.status === 'ERROR') {
        this.hasErrors = true;
        this.$emit('error', this.requestId);
      } else {
        this.hasErrors = false;
      }
    },
    resetScreenState() {
      this.loadingButton = false;
      this.disabled = false;
      if (this.$refs.renderer && this.$refs.renderer.$children[0]) {
        this.$refs.renderer.$children[0].currentPage = 0;
        this.$refs.renderer.restartValidation();
      }
    },
    checkTaskStatus() {
      if (
        this.task.status == 'COMPLETED' ||
        this.task.status == 'CLOSED' ||
        this.task.status == 'TRIGGERED'
      ) {
        this.closeTask();
      } else {
        this.screen = this.task.screen;
      }
      this.prepareTask();
    },
    disableForSelfService() {
      this.$nextTick(() => {
        if (window.ProcessMaker.isSelfService) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      });
    },
    closeTask(parentRequestId = null) {
      if (this.hasErrors) {
        this.$emit('error', this.requestId);
        return;
      }

      if (this.task.process_request.status === 'COMPLETED') {
        this.loadNextAssignedTask(parentRequestId);
      } else if (this.loadingButton) {
        this.loadNextAssignedTask(parentRequestId);
      } else if (this.task.allow_interstitial) {
        this.task.interstitial_screen['_interstitial'] = true;
        this.screen = this.task.interstitial_screen;
        this.loadNextAssignedTask(parentRequestId);
      } else if (!this.taskPreview) {
        this.$emit('closed', this.task.id);
      }
    },
    loadNextAssignedTask(requestId = null) {
      if (!requestId) {
        requestId = this.requestId;
      }
      const timestamp = !window.Cypress ? `&t=${Date.now()}` : "";
      const url = `?user_id=${this.userId}&status=ACTIVE&process_request_id=${requestId}&include_sub_tasks=1${timestamp}`;
      return this.$dataProvider
        .getTasks(url).then((response) => {
          if (response.data.data.length > 0) {
            let task = response.data.data[0];
            if (task.process_request_id !== this.requestId) {
              // Next task is in a subprocess, do a hard redirect
              if (this.redirecting === task.process_request_id) {
                return;
              }
              this.unsubscribeSocketListeners();
              this.redirecting = task.process_request_id;
              this.$emit('redirect', task.id, true);
              return;
            } else {
              this.emitIfTaskCompleted(requestId);
            }
            this.taskId = task.id;
            this.nodeId = task.element_id;
          } else if (this.parentRequest && ['COMPLETED', 'CLOSED'].includes(this.task.process_request.status)) {
            this.$emit('completed', this.getAllowedRequestId());
          }
        });
    },
    emitIfTaskCompleted(requestId) {
      // Only emit completed after getting the subprocess tasks and there are no tasks and process is completed
      if (this.task
          && this.parentRequest
          && requestId == this.task.process_request_id
          && this.task.process_request.status === 'COMPLETED') {
        this.$emit('completed',  this.parentRequest);
      }
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
    submit(formData = null, loading = false, buttonInfo = null) {
      //single click
      if (this.disabled) {
        return;
      }
      this.disabled = true;

      if (formData) {
        this.onUpdate(Object.assign({}, this.requestData, formData));
      }

      if (loading) {
        this.loadingButton = true;
      } else {
        this.loadingButton = false;
      }
      this.$emit('submit', this.task, loading, buttonInfo);

      if (this.task?.allow_interstitial && !this.loadingButton && !this.disableInterstitial) {
        this.task.interstitial_screen['_interstitial'] = true;
        this.screen = this.task.interstitial_screen;
      }
    },
    onUpdate(data) {
      this.$emit('input', data);
      this.disableForSelfService();
    },
    activityAssigned() {
      // This may no longer be needed
    },
    processCompleted() {
      let requestId;
      if (this.parentRequest) {
        requestId = this.getAllowedRequestId();
        this.$emit('completed', requestId);
      }
      if (requestId !== this.requestId) {
        this.$emit('completed', this.requestId);
      }
    },
    getAllowedRequestId() {
      const permissions = this.task.user_request_permission || [];
      const permission = permissions.find(item => item.process_request_id === this.parentRequest)
      const allowed = permission && permission.allowed;
      return allowed ? this.parentRequest : this.requestId
    },
    processUpdated: _.debounce(function(data) {
      if (data.event === 'ACTIVITY_ACTIVATED') {
        this.reload();
      }
      if (data.event === 'ACTIVITY_EXCEPTION') {
        this.$emit('error', this.requestId);
      }
    }, 300),
    initSocketListeners() {
      this.addSocketListener(
        `completed-${this.requestId}`,
        `ProcessMaker.Models.ProcessRequest.${this.requestId}`,
        '.ProcessCompleted',
        (data) => {
          this.processCompleted(data);
        }
      );

      this.addSocketListener(
        `updated-${this.requestId}`,
        `ProcessMaker.Models.ProcessRequest.${this.requestId}`,
        '.ProcessUpdated',
        (data) => {
          this.processUpdated(data);
        }
      );

      // We might have missed an event before initSocketListeners
      // was called so reload to check if there's a task waiting
      if (!this.taskId) {
        this.reload();
      }
    },
    existsEventMessage(id, data) {
      if (sessionStorage.getItem(id)) {
        return true;
      }
      sessionStorage.setItem(id, data);
      return false;
    },
    listenForParentChanges() {
      if (!this.parentRequest) {
        return;
      }
      this.addSocketListener(
        `parent-${this.requestId}`,
        `ProcessMaker.Models.ProcessRequest.${this.parentRequest}`,
        '.ProcessUpdated',
        (data) => {
          if (
            ['ACTIVITY_ACTIVATED'].includes(data.event) &&
            !this.existsEventMessage(`${data.event}-${this.userId}-${this.taskId}`)
          ) {
            this.closeTask(this.parentRequest);
          }
          if (
            ["ACTIVITY_COMPLETED"].includes(data.event) &&
            !this.existsEventMessage(`${data.event}-${this.userId}-${this.taskId}`)
          ) {
            if (this.task.process_request.status === 'COMPLETED') {
              this.processCompleted();
            }
          }
          if (data.event === 'ACTIVITY_EXCEPTION') {
            this.$emit('error', this.requestId);
          }
        }
      );
    },
    addSocketListener(key, channel, event, callback) {
      if (key in this.socketListeners) {
        return;
      }
      this.socketListeners[key] = {
        channel,
        event,
      };
      window.Echo.private(channel).listen(event, (data) => {
        callback(data);
      });
    },
    unsubscribeSocketListeners() {
      Object.values(this.socketListeners).forEach(element => {
        window.Echo.private(element.channel).stopListening(element.event);
      });
      this.socketListeners = {};
    },
    obtainPayload(url) {
      return new Promise((resolve) => {
        window.ProcessMaker.apiClient
          .get(url)
          .then((response) => {
            resolve(response.data);
          })
          .catch(() => {
            // User does not have access to the resource. Ignore.
          });
      });
    },
    setMetaValue() {
      const requestIdNode = document.head.querySelector('meta[name="request-id"]');
      if (requestIdNode) {
        requestIdNode.setAttribute('content', this.requestId);
      }
    },

  },
  mounted() {
    this.screenId = this.initialScreenId;
    this.taskId = this.initialTaskId;
    this.requestId = this.initialRequestId;
    this.processId = this.initialProcessId;
    this.nodeId = this.initialNodeId;
    this.requestData = this.value;
    this.loopContext = this.initialLoopContext;
  },
  destroyed() {
    this.unsubscribeSocketListeners();
  },
};
</script>
