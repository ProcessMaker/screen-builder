<template>
  <div v-if="showTable">
    <vuetable
      ref="vuetable"
      :data-manager="dataManager"
      :sort-order="sortOrder"
      :api-mode="false"
      :fields="fields"
      :data="tableData"
      :css="css"
      data-path="data"
      pagination-path="meta"
    >
      <template slot="name" slot-scope="props">
        <b-link
          v-uni-id="props.rowData.id.toString()"
          :href="onAction('edit', props.rowData, props.rowIndex)"
        >
          {{ props.rowData.element_name }}
        </b-link>
      </template>
      <template slot="requestName" slot-scope="props">
        <b-link
          :href="onAction('showRequestSummary', props.rowData, props.rowIndex)"
        >
          #{{ props.rowData.process_request.id }}
          {{ props.rowData.process_request.name }}
        </b-link>
      </template>
      <template slot="dueDate" slot-scope="props">
        <span :class="classDueDate(props.rowData.due_at)">
          {{ formatDate(props.rowData.due_at) }}
        </span>
      </template>
      <template slot="completedDate" slot-scope="props">
        <span class="text-dark">
          {{ formatDate(props.rowData.completed_at) }}
        </span>
      </template>
      <template slot="preview" slot-scope="props">
        <span>
          <i class="fa fa-eye" @click="previewTasks(props.rowData)" />
        </span>
      </template>
    </vuetable>
    <component :is="tasksPreview" ref="preview-sidebar" />
  </div>
  <div v-else>
    <formEmpty link="Tasks" title="No tasks in sight" :url="noDataUrl" />
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import datatableMixin from "../../mixins/datatable";
import formEmpty from "./form-empty-table.vue";

const uniqIdsMixin = createUniqIdsMixin();
export default {
  components: { formEmpty },
  mixins: [uniqIdsMixin, datatableMixin],
  data() {
    return {
      countInProgress: "0",
      countOverdue: "0",
      countResponse: "0",
      fields: [],
      data: [],
      tableData: [],
      orderBy: "ID",
      order_direction: "DESC",
      status: "",
      showTable: true,
      sortOrder: [
        {
          field: "ID",
          sortField: "ID",
          direction: "DESC"
        }
      ],
      tasksPreview:
        (window.SharedComponents && window.SharedComponents.TasksHome) || {}
    };
  },
  computed: {
    noDataUrl() {
      return `${window.ProcessMaker?.app?.url}/tasks`;
    }
  },
  mounted() {
    this.setFields();
    this.pmql = `(user_id = ${ProcessMaker.user.id}) AND (status = "In Progress")`;
    this.fetch();
    this.$root.$on("dropdownSelectionTask", this.fetchData);
    this.$root.$on("searchTask", this.fetchSearch);
  },
  methods: {
    getSortParam() {
      if (this.sortOrder instanceof Array && this.sortOrder.length > 0) {
        return `&order_by=${this.sortOrder[0].sortField}&order_direction=${this.sortOrder[0].direction}`;
      }
      return "";
    },

    fetch() {
      Vue.nextTick(() => {
        let pmql = "";
        let filterDropdowns = "";

        if (this.pmql !== undefined) {
          pmql = this.pmql;
        }

        if (this.filterDropdowns !== undefined) {
          filterDropdowns = this.filterDropdowns;
        }

        let { filter } = this;
        let filterParams = "";

        if (filter && filter.length) {
          if (filter.isPMQL()) {
            pmql = `(${pmql}) and (${filter})`;
            filter = "";
          } else {
            filterParams = `&user_id=${window.ProcessMaker.user.id}&filter=${filter}&statusfilter=ACTIVE,CLOSED`;
          }
        }

        if (this.previousFilter !== filter) {
          this.page = 1;
        }

        this.previousFilter = filter;

        if (this.previousPmql !== pmql) {
          this.page = 1;
        }

        this.previousPmql = pmql;

        const tasksDropdown = [];

        // Load from our api client
        ProcessMaker.apiClient
          .get(
            `tasks?page=${this.page}&include=process,processRequest,processRequest.user,user,data` +
              `&pmql=${encodeURIComponent(pmql)}&per_page=${
                this.perPage
              }${filterParams}${this.getSortParam()}&non_system=true&${filterDropdowns}`
          )
          .then((response) => {
            this.showTable = response.data.data.length !== 0;
            this.tableData = response.data;
            this.countResponse = this.tableData.meta.total;
            this.countOverdue = `${this.tableData.meta.in_overdue}`;
            tasksDropdown.push(this.countOverdue);
            this.countInProgress = `${this.tableData.meta.total}`;
            tasksDropdown.push(this.countInProgress);
            const dataControls = {
              count: `${this.countResponse}`,
              showControl: true,
              showAvatar: true,
              variant: "warning",
              textColor: "text-warning",
              colorText: "color: #ff9900",
              url: "/tasks",
              dropdownShow: "tasks"
            };
            this.$emit("tasksCount", { dataControls, tasksDropdown });
          })
          .catch(() => {
            this.tableData = [];
          });
      });
    },
    getColumns() {
      const columns = [
        {
          label: "Task",
          field: "task",
          sortable: true,
          default: true
        },
        {
          label: "Request",
          field: "request",
          sortable: true,
          default: true
        }
      ];

      if (this.status === "CLOSED") {
        columns.push({
          label: "Completed",
          field: "completed_at",
          sortable: true,
          default: true
        });
      } else {
        columns.push({
          label: "Due",
          field: "due_at",
          sortable: true,
          default: true
        });
      }
      return columns;
    },
    setFields() {
      const columns = this.getColumns();

      columns.forEach((column) => {
        const field = {
          title: () => this.$t(column.label)
        };

        switch (column.field) {
          case "task":
            field.name = "__slot:name";
            field.field = "element_name";
            field.sortField = "element_name";
            break;
          case "request":
            field.name = "__slot:requestName";
            field.sortField = "process_requests.id,process_requests.name";
            break;
          case "due_at":
            field.name = "__slot:dueDate";
            break;
          case "completed_at":
            field.name = "__slot:completedDate";
            break;
          default:
            field.name = column.field;
        }

        if (!field.field) {
          field.field = column.field;
        }

        if (column.format === "datetime" || column.format === "date") {
          field.callback = "formatDate";
        }

        if (column.sortable && !field.sortField) {
          field.sortField = column.field;
        }

        this.fields.push(field);
      });

      this.fields.push({
        name: "__slot:preview",
        title: ""
      });

      this.$nextTick(() => {
        this.$refs.vuetable.normalizeFields();
      });
    },
    formatDate(value, format) {
      format = format || "";
      if (value) {
        return window.moment(value).format(format);
      }
      return "n/a";
    },
    onAction(action, rowData, index) {
      let link = "";
      if (action === "edit") {
        link = `/tasks/${rowData.id}/edit`;
      }

      if (action === "showRequestSummary") {
        link = `/requests/${rowData.process_request.id}`;
      }
      return link;
    },
    /**
     * Show the preview tasks
     */
    previewTasks(info) {
      this.$refs["preview-sidebar"].showSideBar(
        info,
        this.tableData.data,
        true
      );
    },
    classDueDate(value) {
      const dueDate = moment(value);
      const now = moment();
      const diff = dueDate.diff(now, "hours");
      return diff < 0
        ? "text-danger"
        : diff <= 1
        ? "text-warning"
        : "text-dark";
    },
    fetchData(selectedOption) {
      if (selectedOption === "In Progress" || selectedOption === "View All") {
        this.filterDropdowns = "";
        this.pmql = `(user_id = ${ProcessMaker.user.id}) AND (status = "In Progress")`;
      }
      if (selectedOption === "Overdue") {
        this.filterDropdowns = "overdue=true";
      }
      this.fetch();
    },
    fetchSearch(searchData) {
      this.pmql = "";
      this.pmql = searchData;
      this.fetch();
    }
  }
};
</script>
