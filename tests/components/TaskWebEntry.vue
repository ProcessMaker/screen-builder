<template>
  <b-row>
    <b-col cols="8">
      <b-tabs>
        <b-tab active title="Form">
          <task
            v-model="data"
            :initial-request-id="task.process_request.id"
            :initial-task-id="task.id"
            @submit="submit"
            :is-web-entry="true"
            @completed="completed"
          />
        </b-tab>
        <b-tab title="Data">
          <monaco-editor
            class="data-editor"
            language="json"
            :value="JSON.stringify(data, null, 4)"
            :options="{ automaticLayout: true, minimap: { enabled: false } }"
          />
          <div class="text-right">
            <b-button variant="secondary">{{ __("Save") }}</b-button>
          </div>
        </b-tab>
      </b-tabs>
    </b-col>
  </b-row>
</template>

<script>
import moment from "moment";
import MonacoEditor from "vue-monaco";
import Screens from "../e2e/fixtures/webentry.json";

export default {
  components: { MonacoEditor },
  data() {
    return {
      data: {},
      task: {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, "day").toISOString(),
        user: {
          avatar: "",
          fullname: "Assigned User"
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE",
          user: {
            avatar: "",
            fullname: "Requester User"
          }
        },
        process: {
          id: 1,
          name: "Process Name"
        },
        request_data: {}
      }
    };
  },
  methods: {
    completed(e){
      console.log('task was completed', e);
    },
    moment(...args) {
      return moment(...args);
    },
    __(text) {
      return text;
    },
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    submit(task) {
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      const taskId = task.id;
      const formData = task.request_data;
      window.ProcessMaker.apiClient
        .put(`/tasks/${taskId}`, { status: "COMPLETED", data: formData })
        .then(() => {
          alert("Task Completed Successfully");
        })
        .finally(() => {
          this.disabled = false;
        });
    }
  }
};
</script>

<style scoped>
.data-editor {
  border: 1px solid gray;
  min-height: 400px;
}
</style>
