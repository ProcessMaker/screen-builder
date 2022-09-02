<template>
  <b-row>
    <b-col cols="12">
      <b-tabs>
        <b-tab active title="WebEntry">
          <vue-form-renderer
            v-model="data"
            v-bind:config="task.screen.config"
            v-bind:computed="task.screen.computed"
            v-bind:custom-css="task.screen.custom_css"
            v-bind:watchers="task.screen.watchers"
            @submit="submit"
          />
        </b-tab>
      </b-tabs>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment';
import MonacoEditor from 'vue-monaco';
import Screens from '../e2e/fixtures/webentry.json';

export default {
  components: {MonacoEditor},
  data() {
    return {
      data: {},
      task: {
        id: 1,
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, 'day').toISOString(),
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
      },
    };
  },
  methods: {
    moment(...args) {
      return moment(...args);
    },
    __(text) {
      return text;
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    },
    submit() {
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      window.ProcessMaker.apiClient
        .put('tasks/' + this.task.id, {status:'COMPLETED', data: this.data})
        .then(() => {
          window.ProcessMaker.alert(this.__('Task Completed Successfully'), 'success', 5, true);
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