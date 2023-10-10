<template>
  <vuetable ref="vuetable" :api-mode="false" :fields="fields" :data="tableData">
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
      filter: "",
      data: [],
      tableData: [],
      orderBy: "id",
      orderDirection: "DESC",
      additionalParams: "",
      perPage: 10,
      sortOrder: [
        {
          field: "id",
          sortField: "id",
          direction: "desc"
        }
      ]
    };
  },
  mounted() {
    this.setFields();
    this.fetch();
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
              `&per_page=${this.perPage}&filter=${filter}&order_by=${
                this.orderBy === "__slot:ids" ? "id" : this.orderBy
              }&order_direction=${this.orderDirection}${this.additionalParams}`
          )
          .then((response) => {
            for (const record of response.data.data) {
              // format Status
              record.status = this.formatStatus(record.status);
            }
            this.tableData = response.data;
            this.countResponse = Object.keys(this.tableData.data).length;
            const dataRequests = {
              count: `${this.countResponse}`,
              showControl: true,
              showAvatar: true,
              variant: "primary",
              textColor: "text-primary",
              colorText: "color: #1572C2"
            };
            this.$emit("requestsCount", dataRequests);
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
        title: "#"
      });

      this.fields.push({
        name: "__slot:name",
        field: "name",
        title: () => this.$t("Name")
      });

      this.fields.push({
        name: "__slot:status",
        field: "status",
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
    }
  }
};
</script>
