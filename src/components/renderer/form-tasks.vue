<template>
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
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import datatableMixin from "../../mixins/datatable";

const uniqIdsMixin = createUniqIdsMixin();
export default {
  mixins: [uniqIdsMixin, datatableMixin],
  data() {
    return {
      countResponse: "0",
      fields: [],
      data: [],
      tableData: [],
      orderBy: "ID",
      order_direction: "DESC",
      status: "",
      sortOrder: [
        {
          field: "ID",
          sortField: "ID",
          direction: "DESC"
        }
      ]
    };
  },
  mounted() {
    this.setFields();
    this.fetch();
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

        if (this.pmql !== undefined) {
          pmql = this.pmql;
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

        // Load from our api client
        ProcessMaker.apiClient
          .get(
            `tasks?page=${this.page}&include=process,processRequest,processRequest.user,user,data` +
              `&per_page=${
                this.perPage
              }${filterParams}${this.getSortParam()}&non_system=true`
          )
          .then((response) => {
            this.tableData = response.data;
            this.countResponse = Object.keys(this.tableData.data).length;
            const dataTasks = {
              count: `${this.countResponse}`,
              showControl: true,
              showAvatar: true,
              variant: "warning",
              textColor: "text-warning",
              colorText: "color: #ff9900",
              url: "/tasks",
              dropdownShow: "tasks"
            };
            this.$emit("tasksCount", dataTasks);
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
    previewTasks() {
      console.log("preview");
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
    }
  }
};
</script>
