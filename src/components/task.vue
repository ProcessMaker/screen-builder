<template>
  <div
    id="tab-form"
    role="tabpanel"
    aria-labelledby="tab-form"
    class="tab-pane active show h-100"
  >
    <template v-if="screen">
      <b-overlay
          :show="disabled || isSelfService"
          id="overlay-background"
          :variant="isSelfService ? 'white' : 'transparent'"
          :blur="null"
          cardStyles="pointer-events: none;pointer-events: none;inset: 1px"
          rounded="sm"
      >
      <template #overlay>
        <div class="text-center">
          <p v-if="isSelfService">Please claim this task to continue.</p>
        </div>
      </template>
      <div class="card card-body border-top-0 h-100" :class="screenTypeClass">
        <div v-if="renderComponent === 'task-screen'">
          <vue-form-renderer
            ref="renderer"
            v-model="requestData"
            :class="{ loading: loadingTask || loadingListeners }"
            :config="screen.config"
            :computed="screen.computed"
            :custom-css="screen.custom_css"
            :watchers="screen.watchers"
            :key="refreshScreen"
            :loop-context="loopContext"
            @update="onUpdate"
            @after-submit="afterSubmit"
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
            @after-submit="afterSubmit"
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
    screenVersion: { type: Number, default: null },
    userId: { type: Number, default: null },
    csrfToken: { type: String, default: null },
    value: { type: Object, default: () => {} },
    beforeLoadTask: { type: Function, default: defaultBeforeLoadTask },
    initialLoopContext: { type: String, default: "" },
    taskPreview: { type: Boolean, default: false },
    loading: { type: Number, default: null },
    alwaysAllowEditing: { type: Boolean, default: false },
    disableInterstitial: { type: Boolean, default: false },
    waitLoadingListeners: { type: Boolean, default: false },
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
      loadingTask: false,
      loadingListeners: this.waitLoadingListeners,
      isSelfService: false,
    };
  },
  watch: {
    initialScreenId: {
      handler() {
        this.screenId = this.initialScreenId;
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
    loadTask(mounting = false) {
      if (!this.taskId) {
        return;
      }

      let url = `/${this.taskId}?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination`;

      if (this.screenVersion) {
        url += `&screen_version=${this.screenVersion}`;
      }

      // For Vocabularies
      if (window.ProcessMaker && window.ProcessMaker.packages && window.ProcessMaker.packages.includes('package-vocabularies')) {
        window.ProcessMaker.VocabulariesSchemaUrl = `vocabularies/task_schema/${this.taskId}`;
      }

      return this.beforeLoadTask(this.taskId, this.nodeId).then(() => {
        this.$dataProvider
          .getTasks(url)
          .then((response) => {
            this.task = response.data;
            this.linkTask(mounting);
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
          })
          .finally(() => {
            this.loadingTask = false;
          });
      });
    },
    linkTask(mounting) {
      this.nodeId = this.task.element_id;
      this.listenForParentChanges();
      if (this.task.process_request.status === 'COMPLETED') {
        if (!this.taskPreview) {
          this.$emit('completed', this.task.process_request.id);
          // When the process ends before the request is opened
          if (mounting) {
            // get end event element destination config
            window.ProcessMaker.apiClient.get(`/requests/${this.requestId}/end-event-destination`)
              .then((response) => {
                if (!response.data?.data?.endEventDestination) {
                  // by default it goes to summary
                  window.location.href = `/requests/${this.requestId}`;
                  return;
                }

                // process the end event destination
                this.processCompletedRedirect(response.data.data, this.userId, this.requestId);
              });
          }
        }
      }
      if (this.taskPreview && this.task.status === "CLOSED") {
        this.task.interstitial_screen['_interstitial'] = false;
        if (!this.alwaysAllowEditing) {
          this.task.screen.config = this.disableForm(this.task.screen.config);
        }
        this.screen = this.task.screen;
      }
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
    setSelfService() {
      this.$nextTick(() => {
        if (window.ProcessMaker.isSelfService) {
          this.isSelfService = true;
        } else {
          this.isSelfService = false;
        }
      });
    },
    /**
     * Closes the current task and performs necessary actions based on task properties.
     * @param {string|null} parentRequestId - The parent request ID.
     */
    closeTask(parentRequestId = null) {
      if (this.hasErrors) {
        this.emitError();
      }

      if (this.shouldLoadNextTask()) {
        this.loadNextAssignedTask(parentRequestId);
      } else if (this.task.allow_interstitial) {
        this.showInterstitial(parentRequestId);
      } else if (!this.taskPreview) {
        this.emitClosedEvent();
      }
    },

    /**
     * Checks if the next task should be loaded.
     * @returns {boolean} - True if the next task should be loaded, otherwise false.
     */
    shouldLoadNextTask() {
      return (
        this.task.process_request.status === "COMPLETED" || this.loadingButton
      );
    },
    /**
     * Shows the interstitial screen and loads the next assigned task.
     * @param {string|null} parentRequestId - The parent request ID.
     */
    showInterstitial(parentRequestId) {
      // Show the interstitial screen
      this.task.interstitial_screen['_interstitial'] = true;
      this.screen = this.task.interstitial_screen;

      // Load the next assigned task
      this.loadNextAssignedTask(parentRequestId);
    },
    /**
     * Emits an error event.
     */
    emitError() {
      this.$emit('error', this.requestId);
    },
    /**
     * Emits a closed event.
     */
    async emitClosedEvent() {
      this.$emit("closed", this.task?.id, await this.getDestinationUrl());
    },
    /**
     * Retrieves the destination URL for the closed event.
     * @returns {string|null} - The destination URL.
     */
    // eslint-disable-next-line consistent-return
    async getDestinationUrl() {
      const { elementDestination, allow_interstitial: allowInterstitial } = this.task || {};

      if (!elementDestination) {
        return null;
      }

      if (elementDestination.type === "taskSource") {
        try {
          const params = {
            processRequestId: this.requestId,
            status: "ACTIVE",
            userId: this.userId,
          };

          const response = await this.retryApiCall(() => this.getTasks(params));

          const firstTask = response.data.data[0];
          if (allowInterstitial && firstTask?.user_id === this.userId) {
            return `/tasks/${firstTask.id}/edit`;
          }

          return this.getSessionRedirectUrl();
        } catch (error) {
          console.error("Error in getDestinationUrl:", error);
          return null;
        }
      }

      const elementDestinationUrl = elementDestination.value;
      if (elementDestinationUrl) {
        // Save the referring URL to sessionStorage for future verification
        sessionStorage.setItem('sessionUrlActionBlocker', document.referrer);
        return elementDestinationUrl;
      }

      const sessionStorageUrl = sessionStorage.getItem("elementDestinationURL");
      return sessionStorageUrl || null;
    },
    /**
     * Retrieves the URL from the session storage or the document referrer.
     *
     * This method is used to determine the source of the redirection when the task is claimed.
     * It retrieves the 'sessionUrlSelfService' value from sessionStorage, and if present, removes it.
     * If the value is not found, it returns the document referrer.
     *
     * @returns {string|null} - The URL from the session storage or the document referrer.
     */
    getSessionRedirectUrl() {
      const urlSelfService = sessionStorage.getItem('sessionUrlSelfService');

      if (urlSelfService) {
        // Remove 'sessionUrlSelfService' from sessionStorage after retrieving its value
        sessionStorage.removeItem('sessionUrlSelfService');
        // Emit the source of the redirection
        return urlSelfService;
      }
      // If the task has not an origin source it should re redirected top the tasks List as default.
      return document.referrer || '/tasks';
    },
    loadNextAssignedTask(requestId = null) {
      if (!requestId) {
        requestId = this.requestId;
      }
      if (!this.userId) {
        return;
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
            this.loadTask();
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
    afterSubmit() {
      this.$emit('after-submit', ...arguments);
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
      if (this.task?.bpmn_tag_name === 'manualTask') {
        this.checkTaskStatus();
        this.reload();
      }
    },
    onUpdate(data) {
      this.$emit('input', data);
      this.setSelfService();
    },
    activityAssigned() {
      // This may no longer be needed
    },
    processCompleted(data = null) {
      let requestId;
      if (this.parentRequest) {
        requestId = this.getAllowedRequestId();
        this.$emit('completed', requestId);
      }
    },
    /**
     * Makes an API call with retry logic.
     * @param {Function} apiCall - The API call to be made.
     * @param {number} retries - The number of retry attempts.
     * @param {number} delay - The delay between retries in milliseconds.
     * @returns {Promise} - The response from the API call.
     */
    // eslint-disable-next-line consistent-return
    async retryApiCall(apiCall, retries = 3, delay = 1000) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await apiCall();
          return response;
        } catch (error) {
          if (attempt === retries - 1) {
            throw error;
          }
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
        }
      }
    },
    /**
     * Gets the next request by posting to the specified endpoint.
     * @param {string} processId - The process ID.
     * @param {string} startEvent - The start event.
     * @returns {Promise} - The response from the API call.
     */
    getNextRequest(processId, startEvent) {
      return window.ProcessMaker.apiClient.post(
        `/process_events/${processId}?event=${startEvent}`,
        {}
      );
    },

    /**
     * Gets the tasks for the specified process request ID.
     * @param {object} params - The query params.
     * @returns {Promise} - The response from the API call.
     */

    getTasks(params) {
      const queryParams = {
        user_id: this.userId,
        process_request_id: params.processRequestId,
        page: params.page || 1,
        per_page: params.perPage || 1,
        status: params.status,
      };

      const queryString = new URLSearchParams(queryParams).toString();

      return this.$dataProvider.getTasks(`?${queryString}`);
    },
    /**
     * Parses a JSON string and returns the result.
     * @param {string} jsonString - The JSON string to parse.
     * @returns {object|null} - The parsed object or null if parsing fails.
     */
    parseJsonSafely(jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error("Invalid JSON string:", error);
        return null;
      }
    },
    /**
     * Handles the process completion and redirects the user based on the task assignment.
     * @param {object} data - The data object containing endEventDestination.
     * @param {string} userId - The ID of the current user.
     * @param {string} requestId - The ID of the current request.
     */
    async processCompletedRedirect(data, userId, requestId) {
      try {
        // Verify if is not anotherProcess type
        if (data.endEventDestination.type !== "anotherProcess") {
          if (data?.endEventDestination.value) {
            window.location.href = data?.endEventDestination.value;
          } else {
            window.location.href = `/requests/${this.requestId}`;
          }
          return;
        }
        // Parse endEventDestination from the provided data
        const endEventDestination = this.parseJsonSafely(
          data.endEventDestination.value
        );
        // Get the next request using retry logic
        const nextRequest = await this.retryApiCall(() =>
          this.getNextRequest(
            endEventDestination.processId,
            endEventDestination.startEvent
          )
        );

        const params = {
          processRequestId: nextRequest.data.id,
          status: "ACTIVE",
          page: 1,
          perPage: 1
        };
        // Get the tasks for the next request using retry logic
        const response = await this.retryApiCall(() => this.getTasks(params));
        // Handle the first task from the response
        const firstTask = response.data.data[0];
        if (firstTask && firstTask.user_id === userId) {
          this.redirectToTask(firstTask.id);
        } else {
          this.redirectToRequest(requestId);
        }
      } catch (error) {
        console.error("Error processing completed redirect:", error);
        this.$emit("completed", requestId);
      }
    },
    getAllowedRequestId() {
      const permissions = this.task.user_request_permission || [];
      const permission = permissions.find(item => item.process_request_id === this.parentRequest)
      const allowed = permission && permission.allowed;
      return allowed ? this.parentRequest : this.requestId
    },
    redirectToTask(tokenId) {
      this.$emit('redirect', tokenId);
    },
    redirectToRequest(requestId) {
      window.location.href = `/requests/${requestId}`;
    },
    /**
     * Initializes socket listeners for process updates and redirects.
     * This method sets up listeners to handle specific events and reloads
     * the task if necessary.
     */
    initSocketListeners() {
      this.addProcessUpdateListener();
      this.addRedirectListener();
      this.loadingListeners = false;

      // Reload to check if there's a task waiting, in case an event was missed
      if (!this.taskId) {
        this.reload();
      }
    },

    /**
     * Adds a socket listener for process updates.
     * Listens for specific events related to the process and triggers appropriate actions.
     */
    addProcessUpdateListener() {
      this.addSocketListener(
        `updated-${this.requestId}`,
        `ProcessMaker.Models.ProcessRequest.${this.requestId}`,
        '.ProcessUpdated',
        (data) => this.handleProcessUpdate(data)
      );
    },

    /**
     * Handles process update events.
     * Emits an error if an activity exception event is detected.
     *
     * @param {Object} data - The event data received from the socket listener.
     */
    handleProcessUpdate(data) {
      if (data.event === 'ACTIVITY_EXCEPTION') {
        this.$emit('error', this.requestId);
        window.location.href = `/requests/${this.requestId}`;
      }
    },

    /**
     * Adds a socket listener for redirect events.
     * Listens for specific redirect actions and handles them according to the method provided.
     */
    addRedirectListener() {
      this.addSocketListener(
        `redirect-${this.requestId}`,
        `ProcessMaker.Models.ProcessRequest.${this.requestId}`,
        '.RedirectTo',
        (data) => this.handleRedirect(data)
      );
    },

    /**
     * Handles redirect events based on the method provided in the event data.
     * Calls specific handlers for different redirect methods or falls back to a default redirect.
     *
     * @param {Object} data - The event data received from the socket listener.
     */
    handleRedirect(data) {
      switch (data.method) {
        case 'redirectToTask':
          this.handleRedirectToTask(data);
          break;
        case 'processUpdated':
          this.handleProcessUpdated(data);
          break;
        case 'processCompletedRedirect':
          this.processCompletedRedirect(
            data.params[0],
            this.userId,
            this.requestId
          );
          break;
        default:
          this.handleDefaultRedirect(data);
      }
    },

    /**
     * Handles the 'redirectToTask' event by loading the specified task.
     * Updates the current task ID and reloads the task data.
     *
     * @param {Object} data - The event data containing the tokenId of the task.
     */
    async handleRedirectToTask(data) {
      if (data?.params[0]?.tokenId) {
        this.loadingTask = true;
        // Check if interstitial tasks are allowed for this task.
        if (this.task && !(this.task.allow_interstitial || this.isSameUser(this.task, data))) {
           // The getDestinationUrl() function is called asynchronously to retrieve the URL
          window.location.href = await this.getDestinationUrl();
          return;
        }
        this.nodeId = data.params[0].nodeId;
        this.taskId = data.params[0].tokenId;
        this.reload();
      }
    },

    /**
     * Checks if the current task and the redirect data belong to the same user.
     * and the destination is taskSource.
     *
     * @param {Object} currentTask - The current task object.
     * @param {Object} redirectData - The redirect data object.
     */
    isSameUser(currentTask, redirectData) {
      const userIdMatch = currentTask.user?.id === redirectData.params[0].userId;
      const typeMatch = currentTask.elementDestination?.type === null
                      || currentTask.elementDestination?.type === 'taskSource';

      return userIdMatch && typeMatch;
    },

    /**
     * Handles the 'processUpdated' event by checking the event type and updating the task if necessary.
     * Reloads the task data if the event is relevant.
     *
     * @param {Object} data - The event data containing the process update information.
     */
    handleProcessUpdated(data) {
      const elementDestinationValue = this.task.elementDestination?.value;

      if (
        elementDestinationValue &&
        data?.params[0]?.tokenId === this.taskId &&
        data?.params[0]?.requestStatus === 'ACTIVE'
      ) {
        window.location.href = elementDestinationValue;
        return;
      }

      if (
        ['ACTIVITY_ACTIVATED', 'ACTIVITY_COMPLETED'].includes(data.event)
        && data.elementType === 'task'
      ) {
        if (!this.task.elementDestination?.type) {
          this.taskId = data.taskId;
        }
        this.reload();
      }
      if (data.event === 'ACTIVITY_EXCEPTION') {
        this.$emit('error', this.requestId);
      }
    },

    /**
     * Handles the default redirect action by logging a warning and redirecting the user to the request page.
     *
     * @param {Object} data - The event data that triggered the default redirect.
     */
    handleDefaultRedirect(data) {
      console.warn('redirect', data);
      window.location.href = `/requests/${this.requestId}`;
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
            ['ACTIVITY_ACTIVATED'].includes(data.event)
          ) {
            this.closeTask(this.parentRequest);
          }
          if (
            ["ACTIVITY_COMPLETED"].includes(data.event)
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
    /**
     * Checks for the presence of a URL action blocker in sessionStorage and handles it.
     *
     * This method retrieves the 'sessionUrlActionBlocker' value from sessionStorage,
     * and if present, removes it and emits a 'closed' event with the task id and
     * the source of the redirection. It returns false if the blocker was handled,
     * and true otherwise.
     *
     * @returns {boolean} Returns false if the 'sessionUrlActionBlocker' was found and handled, true otherwise.
     */
    hasUrlActionBlocker() {
      // Retrieve the 'sessionUrlActionBlocker' value from sessionStorage
      const redirectedFrom = sessionStorage.getItem("sessionUrlActionBlocker");

      if (redirectedFrom) {
        // Remove 'sessionUrlActionBlocker' from sessionStorage after retrieving its value
        sessionStorage.removeItem("sessionUrlActionBlocker");

        // Emit a 'closed' event with the task id and the source of the redirection
        this.$emit("closed", this.task?.id, redirectedFrom);
        return true;
      }
      return false;
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
    this.loadTask(true);
  },
  destroyed() {
    this.unsubscribeSocketListeners();
  },
};
</script>

<style scoped>
.loading {
  pointer-events: none;
}
</style>
