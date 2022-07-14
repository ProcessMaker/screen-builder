<template>
  <b-row>
    <b-col cols="8">
      <b-tabs>
        <b-tab active title="Form">
          <task
            :initial-task-id="task.id"
            v-model="data"
            @submit="submit"
            :initialRequestId="1"
            :userId="1"
            @completed="completed"
            @closed="closed"
            @redirect="redirectToTask"
          />
        </b-tab>
        <b-tab title="Data">
          <monaco-editor
            class="data-editor"
            language="json"
            :value="JSON.stringify(data, null, 4)"
            :options="{automaticLayout: true, minimap: {enabled: false}}"
          />
          <div class="text-right">
            <b-button variant="secondary">{{ __('Save') }}</b-button>
          </div>
        </b-tab>
      </b-tabs>
    </b-col>
    <b-col cols="4">
      <b-card
        no-body
        header="Open"
        header-bg-variant="success"
        header-text-variant="white"
      >
        <b-list-group flush>
          <b-list-group-item>
            <i class="far fa-calendar-alt"/>
            <small>
              {{ __('Due') }}
              {{ formatDateFromNow(task.due_at) }}
            </small>
            <div>{{ formatDate(task.due_at) }}</div>
          </b-list-group-item>
          <b-list-group-item>
            <h5>{{ __('Assigned To') }}</h5>
            <b-avatar/>
            {{ task.user.fullname }}
          </b-list-group-item>
          <b-list-group-item>
            <i class="far fa-calendar-alt"/>
            <small>
              {{ __('Assigned') }}
              {{ formatDateFromNow(task.created_at) }}
            </small>
            <div>{{ formatDate(task.created_at) }}</div>
          </b-list-group-item>
          <b-list-group-item>
            <h5>{{ __('Request') }}</h5>
            <div>
              <a :href="`/requests/${task.process_request.id}`">
                #{{ task.process_request.id }} {{ task.process.name }}
              </a>
            </div>
          </b-list-group-item>
          <b-list-group-item>
            <h5>{{ __('Requested by') }}</h5>
            <b-avatar/>
            {{ task.process_request.user.fullname }}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { format, formatISO, addDays, formatDistanceToNow } from 'date-fns';
import MonacoEditor from 'vue-monaco';
import Screens from '../e2e/fixtures/single_line_input.json';

export default {
  components: {MonacoEditor},
  data() {
    return {
      data: {},
      task: {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        created_at: formatISO(new Date()),
        completed_at: formatISO(new Date()),
        due_at: formatISO(addDays(new Date(), 1)),
        user: {
          avatar: '',
          fullname: 'Assigned User',
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
          user: {
            avatar: '',
            fullname: 'Requester User',
          },
        },
        process: {
          id: 1,
          name: 'Process Name',
        },
        request_data: {},
      },
    };
  },
  methods: {
    completed(processRequestId) {
      window.location.href = '/requests/' + processRequestId;
    },
    closed() {
      window.location.href = 'tasks';
    },
    redirectToTask(task) {
      window.location.href = 'tasks/' + task + '/edit';
    },
    __(text) {
      return text;
    },
    formatDate(date) {
      return format(new Date(date), 'yyyy-MM-dd HH:mm');
    },
    formatDateFromNow(date) {
      return formatDistanceToNow(new Date(date), { addSuffix: true})
    },
    submit(task) {
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      const taskId = task.id;
      const formData = task.request_data;
      window.ProcessMaker.apiClient
        .put('/tasks/' + taskId, {status:'COMPLETED', data: formData})
        .then(() => {
          alert('Task Completed Successfully');
        })
        .finally(() => {
          this.disabled = false;
        });
    },
  },
};
</script>

<style scoped>
.data-editor {
  border: 1px solid gray;
  min-height: 400px;
}
</style>