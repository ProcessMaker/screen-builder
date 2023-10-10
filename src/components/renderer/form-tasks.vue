<template>
  <vuetable ref="vuetable" :api-mode="false" :fields="fields" :data="tableData">
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
    <template slot="preview" slot-scope="props">
      <span>
        <i class="fa fa-eye" @click="previewTasks(props.rowData)" />
      </span>
    </template>
  </vuetable>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";

const uniqIdsMixin = createUniqIdsMixin();
export default {
  mixins: [uniqIdsMixin],
  data() {
    return {
      countResponse: "0",
      fields: [],
      data: [],
      tableData: [],
      orderBy: "ID",
      order_direction: "DESC",
      status: "",
      perPage: 10,
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
              colorText: "color: #ff9900"
            };
            this.$emit("tasksCount", dataTasks);
          })
          .catch(() => {
            this.tableData = [];
          });
      });
    },
    setFields() {
      this.fields.push({
        name: "__slot:name",
        field: "element_name",
        title: () => this.$t("Task")
      });

      this.fields.push({
        name: "__slot:requestName",
        field: "element_name",
        title: () => this.$t("Request")
      });

      this.fields.push({
        name: "__slot:dueDate",
        field: "dueDate",
        title: () => this.$t("Due")
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
