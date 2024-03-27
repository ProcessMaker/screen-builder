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
      <template slot="ids" slot-scope="props">
        <b-link
          class="text-nowrap"
          :href="openRequest(props.rowData, props.rowIndex)"
        >
          #{{ props.rowData.id }}
        </b-link>
      </template>
      <template slot="name" slot-scope="props">
        <span v-uni-id="props.rowData.id.toString()">{{
          props.rowData.name
        }}</span>
      </template>
      <template slot="status" slot-scope="props">
        <span>
          <i :class="`fas fa-circle text-${props.rowData.status.color}`" />
          {{ props.rowData.status.label }}
        </span>
      </template>
      <template slot="actions" slot-scope="props">
        <div class="actions">
          <div class="popout">
            <b-btn
              v-b-tooltip.hover
              v-uni-aria-describedby="props.rowData.id.toString()"
              variant="link"
              :href="openRequest(props.rowData, props.rowIndex)"
              :title="$t('Open Request')"
            >
              <i class="fas fa-caret-square-right fa-lg fa-fw" />
            </b-btn>
          </div>
        </div>
      </template>
    </vuetable>
  </div>
  <div v-else>
    <formEmpty link="Requests" title="No Requests to Show" :url="noDataUrl" />
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
      countResponse: "0",
      fields: [],
      filter: "",
      data: [],
      tableData: [],
      orderBy: "id",
      orderDirection: "DESC",
      additionalParams: "",
      showTable: true,
      sortOrder: [
        {
          field: "id",
          sortField: "id",
          direction: "desc"
        }
      ]
    };
  },
  computed: {
    noDataUrl() {
      return `${window.ProcessMaker?.app?.url}/requests`;
    }
  },
  mounted() {
    this.setFields();
    this.pmql = `requester = "${Processmaker.user.username}"`;
    this.fetch();
    this.$root.$on("dropdownSelectionRequest", this.fetchData);
    this.$root.$on("searchRequest", this.fetchSearch);
  },
  methods: {
    fetch() {
      Vue.nextTick(() => {
        let pmql = "";

        if (this.pmql !== undefined) {
          pmql = this.pmql;
        }

        let { filter } = this;

        if (filter && filter.length) {
          if (filter.isPMQL()) {
            pmql = `(${pmql}) and (${filter})`;
            filter = "";
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
            `requests?page=${this.page}&include=process,participants,data` +
              `&pmql=${encodeURIComponent(pmql)}
              &per_page=${this.perPage}&filter=${filter}&order_by=${
                this.orderBy === "__slot:ids" ? "id" : this.orderBy
              }&order_direction=${this.orderDirection}${this.additionalParams}`
          )
          .then((response) => {
            this.showTable = response.data.data.length !== 0;
            for (const record of response.data.data) {
              // format Status
              record.status = this.formatStatus(record.status);
            }
            this.tableData = response.data;
            this.countResponse = this.tableData.meta.total;
            const dataControls = {
              count: `${this.countResponse}`,
              showControl: true,
              showAvatar: true,
              variant: "primary",
              textColor: "text-primary",
              colorText: "color: #1572C2",
              url: "/requests",
              dropdownShow: "requests"
            };
            const tasksDropdown = [];
            this.$emit("requestsCount", { dataControls, tasksDropdown });
          })
          .catch(() => {
            this.tableData = [];
          });
      });
    },
    setFields() {
      this.fields.push({
        name: "__slot:ids",
        field: "id",
        sortField: "id",
        sortable: true,
        title: "#"
      });

      this.fields.push({
        name: "__slot:name",
        field: "name",
        sortField: "name",
        sortable: true,
        title: () => this.$t("Name")
      });

      this.fields.push({
        name: "__slot:status",
        field: "status",
        sortField: "status",
        sortable: true,
        title: () => this.$t("Status")
      });

      this.fields.push({
        name: "__slot:actions",
        title: ""
      });
      this.$nextTick(() => {
        this.$refs.vuetable.normalizeFields();
      });
    },
    formatStatus(status) {
      let color = "";
      let label = "";
      switch (status) {
        case "DRAFT":
          color = "danger";
          label = "Draft";
          break;
        case "CANCELED":
          color = "danger";
          label = "Canceled";
          break;
        case "COMPLETED":
          color = "primary";
          label = "Completed";
          break;
        case "ERROR":
          color = "danger";
          label = "Error";
          break;
        default:
          color = "success";
          label = "In Progress";
      }
      return { color, label };
    },
    openRequest(data, index) {
      return `/requests/${data.id}`;
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
    fetchData(selectedOptions) {
      if (selectedOptions[0] === "by_me" && selectedOptions[1] !== "all") {
        this.pmql = `(user_id = ${ProcessMaker.user.id}) AND (status = "${selectedOptions[1]}")`;
      }
      if (
        selectedOptions[0] === "as_participant" &&
        selectedOptions[1] !== "all"
      ) {
        this.pmql = `(status = "${selectedOptions[1]}") AND (participant = "${Processmaker.user.username}")`;
      }
      if (selectedOptions[1] === "all") {
        this.pmql = `(user_id = ${ProcessMaker.user.id}) AND ((status = "In Progress") OR (status = "Completed"))`;
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
