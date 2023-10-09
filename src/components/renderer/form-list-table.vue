<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>{{ title }}</h4>
        <div>
          <i class="fas fa-search" />
        </div>
      </div>
      <template v-if="listOption === 'My Tasks'">
        <FormTasks></FormTasks>
      </template>
      <template v-if="listOption === 'My Requests'">
        <FormRequests></FormRequests>
      </template>
      <template v-if="listOption === 'Start new Request'">
        <!--
          TODO Card for New Requests
          <FormNewRequest></FormNewRequest>
        -->
      </template>
    </div>
  </div>
</template>

<script>
import FormTasks from "./form-tasks.vue";
import FormRequests from "./form-requests.vue";

export default {
  components: { FormTasks, FormRequests },
  mixins: [],
  props: ["listOption"],
  data() {
    return {
      title: this.$t("List Table"),
      data: [],
      tableData: [],
      fields: [],
      actions: [
        {
          value: "edit",
          content: "Open Task",
          icon: "fas fa-caret-square-right",
          link: true,
          href: "/tasks/{{id}}/edit"
        },
        {
          value: "showRequestSummary",
          content: "Open Request",
          icon: "fas fa-clipboard",
          link: true,
          href: "/requests/{{process_request.id}}"
        }
      ]
    };
  },
  watch: {
    listOption() {
      this.title = this.listOption;
      // this.populateFields(this.title);
    }
  },
  mounted() {
    this.title = this.listOption;
    // this.populateFields(this.title);
  },
  methods: {
    callAPI(url) {
      try {
        ProcessMaker.apiClient.get(url).then((response) => {
          this.tableData = response.data;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    populateFields(option) {
      this.fields = [];
      if (option === this.$t("My Tasks")) {
        this.callAPI("/tasks");
      }

      if (option === this.$t("My Requests")) {
        this.callAPI("/requests");
      }

      if (option === this.$t("Start new Request")) {
        this.callAPI("/start_processes");
      }
    }
  }
};
</script>

<style lang="scss">
.prevent-interaction.form-list-table::after {
  content: attr(placeholder);
}
</style>
