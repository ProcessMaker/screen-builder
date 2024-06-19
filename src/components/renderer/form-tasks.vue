<template>
  <div v-if="showTable">
    <filter-table
      :headers="tableHeaders"
      :data="tableData"
      :unread="unreadColumnName"
      :loading="shouldShowLoader"
      @table-row-mouseover="handleRowMouseover"
      @table-row-mouseleave="handleRowMouseleave"
    >
      <template
        v-for="(column, index) in tableHeaders"
        v-slot:[column.field]
      >
        <div
          :key="index"
          style="display: inline-block"
        >
          <img
            v-if="column.field === 'is_priority'"
            src="../../assets/priority-header.svg"
            alt="priority-header"
            width="20"
            height="20"
          />
          <span v-else>{{ $t(column.label) }}</span>
        </div>
      </template>
      <template
        v-for="(row, rowIndex) in tableData.data"
        v-slot:[`row-${rowIndex}`]
      >
        <td v-for="(header, colIndex) in tableHeaders"
          :key="`${rowIndex}-${colIndex}`"
        >
          <template v-if="containsHTML(getNestedPropertyValue(row, header))">
            <div
              :id="`element-${rowIndex}-${colIndex}`"
              :class="{ 'pm-table-truncate': header.truncate }"
              :style="{ maxWidth: header.width + 'px' }"
            >
              <span v-html="sanitize(getNestedPropertyValue(row, header))"></span>
            </div>
            <b-tooltip
              v-if="header.truncate"
              :target="`element-${rowIndex}-${colIndex}`"
              custom-class="pm-table-tooltip"
              @show="checkIfTooltipIsNeeded"
            >
              {{ sanitizeTooltip(getNestedPropertyValue(row, header)) }}
            </b-tooltip>
          </template>
          <template v-else>
            <template v-if="isComponent(row[header.field])">
              <component
                :is="row[header.field].component"
                v-bind="row[header.field].props"
              >
              </component>
            </template>
            <template v-else>
              <template v-if="header.field === 'due_at'">
                <span
                  :class="[
                    'badge',
                    'badge-' + row['color_badge'],
                    'due-' + row['color_badge']
                  ]"
                >
                  {{ formatRemainingTime(row.due_at) }}
                </span>
                <span>{{ getNestedPropertyValue(row, header) }}</span>
              </template>
              <template v-else-if="header.field === 'is_priority'">
                <span>
                  <img
                    :src="getImgPriority(row[header.field])"
                    :alt="row[header.field] ? 'priority' : 'no-priority'"
                    width="20"
                    height="20"
                    @click.prevent="togglePriority(row.id, !row[header.field])"
                  />
                </span>
              </template>
              <template v-else>
                <div
                  :id="`element-${rowIndex}-${colIndex}`"
                  :class="{ 'pm-table-truncate': header.truncate }"
                  :style="{ maxWidth: header.width + 'px' }"
                >
                  {{ getNestedPropertyValue(row, header) }}
                  <b-tooltip
                    v-if="header.truncate"
                    :target="`element-${rowIndex}-${colIndex}`"
                    custom-class="pm-table-tooltip"
                    @show="checkIfTooltipIsNeeded"
                  >
                    {{ getNestedPropertyValue(row, header) }}
                  </b-tooltip>
                </div>
              </template>
            </template>
          </template>
        </td>
      </template>
    </filter-table>
    <component
      :is="taskTooltip"
      v-show="isTooltipVisible"
      :position="rowPosition"
    >
      <template v-slot:task-tooltip-body>
        <div @mouseover="clearHideTimer" @mouseleave="hideTooltip">
          <slot
            name="tooltip"
            :tooltip-row-data="tooltipRowData"
            :preview-tasks="previewTasks"
          >
            <span>
              <b-button
                class="icon-button"
                variant="light"
                @click="previewTasks(tooltipRowData)"
              >
                <i class="fas fa-eye" />
              </b-button>
            </span>
          </slot>
        </div>
      </template>
    </component>
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
      tableHeaders: [],
      pmqlSearch: "",
      sortOrder: [
        {
          field: "ID",
          sortField: "ID",
          direction: "DESC"
        }
      ],
      advancedFilter: "",
      tasksPreview:
        (window.SharedComponents && window.SharedComponents.TasksHome) || {},
      taskTooltip:
        (window.SharedComponents && window.SharedComponents.TaskTooltip) || {},
      rowPosition: {},
      ellipsisShow: false,
      isTooltipVisible: false,
      disableRuleTooltip: false,
      hiderTimer: null
    };
  },
  computed: {
    noDataUrl() {
      return `${window.ProcessMaker?.app?.url}/tasks`;
    }
  },
  mounted() {
    this.setupColumns();
    this.pmql = `(user_id = ${ProcessMaker.user.id})`;
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

        if (this.pmqlSearch) {
          pmql = pmql + "AND" + this.pmqlSearch;
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
              `&pmql=${encodeURIComponent(pmql)}
              &per_page=${this.perPage}
              ${filterParams}
              ${this.getSortParam()}
              ${this.advancedFilter}
              &non_system=true&${filterDropdowns}`
          )
          .then((response) => {
            this.showTable = response.data.data.length !== 0;
            for (const record of response.data.data) {
              record["case_title"] = this.formatCaseTitle(record.process_request, record);
              record["color_badge"] = this.formatColorBadge(record["due_at"]);
              record["element_name"] = this.formatActiveTask(record);
            }
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
    formatActiveTask(row) {
      return `
      <a href="${this.openTask(row)}"
        data-cy="active-task-data"
        class="text-nowrap">
        ${row.element_name}
      </a>`;
    },
    formatColorBadge(date) {
      const days = this.remainingTime(date);
      return days >= 0 ? "primary" : "danger";
    },
    formatCaseTitle(processRequest, record) {
      const draftBadge = this.verifyDraft(record);
      return `
        ${draftBadge}
        <a href="${this.openRequest(processRequest)}" class="text-nowrap">
         ${this.getCaseTitle(processRequest, record)}
        </a>`;
    },
    getCaseTitle(process, record) {
      return (
        process.case_title_formatted ||
        process.case_title ||
        record.case_title ||
        ""
      );
    },
    verifyDraft(record) {
      let draftBadge = "";
      if (record.draft && record.status !== "CLOSED") {
        draftBadge = `
          <span class ="badge badge-warning status-warnig">
            ${this.$t("Draft")}
          </span>
        `;
      }
      return draftBadge;
    },
    openTask(data) {
      return `/tasks/${data.id}/edit`;
    },
    openRequest(data) {
      return `/requests/${data.id}`;
    },
    getColumns() {
      const columns = [
        {
          label: "Task",
          field: "element_name",
          sortable: true,
          default: true,
          width: 153,
          fixed_width: 153,
          resizable: false
        },
        {
          label: "Priority",
          field: "is_priority",
          sortable: false,
          default: true,
          width: 48,
          fixed_width: 48,
          resizable: false
        },
        {
          label: "Case title",
          field: "case_title",
          name: "__slot:case_number",
          sortable: true,
          default: true,
          width: 314,
          truncate: true,
          fixed_width: 314,
          resizable: false
        }
      ];

      if (this.status === "CLOSED") {
        columns.push({
          label: "Completed",
          field: "completed_at",
          sortable: true,
          default: true,
          width: 220,
          fixed_width: 220,
          resizable: false
        });
      } else {
        columns.push({
          label: "Due",
          field: "due_at",
          sortable: true,
          default: true,
          width: 220,
          fixed_width: 220,
          resizable: false
        });
      }
      return columns;
    },
    setupColumns() {
      this.tableHeaders = this.getColumns();
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
          case "is_priority":
            field.name = "__slot:is_priority";
            field.field = "is_priority";
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
      this.filterDropdowns = "";
      this.pmql = `(user_id = ${ProcessMaker.user.id})`
      this.advancedFilter = "";
      if (selectedOption === "Self-service") {
        this.pmql = "";
        this.advancedFilter = `&advanced_filter=[${encodeURIComponent('{"subject":{"type":"Status","value":"status"},"operator":"=","value":"Self Service"}')}]`;
      }
      if (selectedOption === "In Progress") {
        this.pmql = this.pmql + `AND (status = "In Progress")`;
      }
      if (selectedOption === "Overdue") {
        this.filterDropdowns = "overdue=true";
      }
      this.fetch();
    },
    fetchSearch(searchData) {
      this.pmqlSearch = "";
      this.pmqlSearch = searchData;
      this.fetch();
    },
    formatRemainingTime(date) {
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const remaining = this.remainingTime(date);
      const daysRemaining = Math.ceil(remaining / millisecondsPerDay);
      if (daysRemaining <= 1 && daysRemaining >= -1) {
        const hoursRemaining = Math.ceil(remaining / (1000 * 60 * 60));
        return `${hoursRemaining}H`;
      }

      return `${daysRemaining}D`;
    },
    remainingTime(date) {
      date = moment(date);
      if (!date.isValid()) {
        return 0;
      }
      return date.diff(this.now);
    },
    sanitizeTooltip(html) {
      let cleanHtml = html.replace(/<script(.*?)>[\s\S]*?<\/script>/gi, "");
      cleanHtml = cleanHtml.replace(/<style(.*?)>[\s\S]*?<\/style>/gi, "");
      cleanHtml = cleanHtml.replace(
        /<(?!img|input|meta|time|button|select|textarea|datalist|progress|meter)[^>]*>/gi,
        ""
      );
      cleanHtml = cleanHtml.replace(/\s+/g, " ");

      return cleanHtml;
    },
    getImgPriority(data) {
      return data ? "/img/priority.svg" : "/img/no-priority.svg";
    },
    togglePriority(taskId, isPriority) {
      ProcessMaker.apiClient
        .put(`tasks/${taskId}/setPriority`, { is_priority: isPriority })
        .then(() => {
          this.fetch();
        });
    },
    handleRowMouseover(row) {
      if (this.ellipsisShow) {
        this.isTooltipVisible = !this.disableRuleTooltip;
        this.clearHideTimer();
        return;
      }
      this.clearHideTimer();

      const tableContainer = document.getElementById("table-container");
      const rectTableContainer = tableContainer.getBoundingClientRect();
      const topAdjust = rectTableContainer.top;

      let elementHeight = 28;

      this.isTooltipVisible = !this.disableRuleTooltip;
      this.tooltipRowData = row;

      const rowElement = document.getElementById(`row-${row.id}`);
      let yPosition = 0;

      const rect = rowElement.getBoundingClientRect();
      yPosition = rect.top + window.scrollY;

      const selectedFiltersBar = document.querySelector(
        ".selected-filters-bar"
      );
      const selectedFiltersBarHeight = selectedFiltersBar
        ? selectedFiltersBar.offsetHeight
        : 0;

      elementHeight -= selectedFiltersBarHeight;

      const rightBorderX = rect.right;

      const bottomBorderY = yPosition - topAdjust - elementHeight + 100;

      this.rowPosition = {
        x: rightBorderX,
        y: bottomBorderY
      };
    },
    handleRowMouseleave() {
      this.startHideTimer();
    },
    startHideTimer() {
      this.hideTimer = setTimeout(() => {
        this.hideTooltip();
      }, 500);
    },
    clearHideTimer() {
      clearTimeout(this.hideTimer);
    },
    hideTooltip() {
      if (this.ellipsisShow) {
        return;
      }
      this.isTooltipVisible = false;
    }
  }
};
</script>

<style scoped>
.due-danger {
  background-color: rgba(237, 72, 88, 0.2);
  color: rgba(237, 72, 88, 1);
  font-weight: 600;
  border-radius: 5px;
}
.due-primary {
  background: rgba(205, 221, 238, 1);
  color: rgba(86, 104, 119, 1);
  font-weight: 600;
  border-radius: 5px;
}
.pm-table-container {
  height: 300px;
}
</style>
