<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <template v-if="dataChild.showControl">
          <div class="mb-2">
            <b-avatar
              size="2em"
              :variant="dataChild.variant"
              :text="dataChild.count"
              class="avatar-text"
            ></b-avatar>
            <p class="control-text" :style="dataChild.colorText">
              {{ title }}
            </p>
          </div>
        </template>
        <!-- <h4></h4> -->
        <div>
          <i class="fas fa-search" />
        </div>
      </div>
      <template v-if="listOption === 'My Tasks'">
        <FormTasks @tasksCount="capturarDato"></FormTasks>
      </template>
      <template v-if="listOption === 'My Requests'">
        <FormRequests @requestsCount="capturarDato"></FormRequests>
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
      dataChild: {},
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
    capturarDato(dato) {
      this.dataChild = dato;
    },
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

.avatar-text {
  display: inline-block;
  margin-right: 10px;
  color: white;
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  font-size: 15.832px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.317px;
}

.control-text {
  display: inline-block;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.28px;
  text-transform: uppercase;
}
</style>
