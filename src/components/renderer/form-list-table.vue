<template>
  <div class="card" :style="customStyle">
    <div class="card-header d-flex justify-content-between align-items-center">
      <template v-if="dataControl.showControl">
        <div class="mb-1 mt-1">
          <b-avatar
            v-if="dataControl.showAvatar"
            size="2em"
            :variant="dataControl.variant"
            :text="dataControl.count"
            class="avatar-text"
          ></b-avatar>
          <p class="control-text mb-0" :style="dataControl.colorText">
            {{ $t(title) }}
          </p>
          <template v-if="dataControl.dropdownShow === 'requests'">
            <b-dropdown variant="outline-secondary" no-caret>
              <template #button-content>
                <i class="fas fa-caret-down" />
              </template>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_filter', 'by_me')"
              >
                {{ $t("As Requester") }}
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_filter', 'as_participant')"
              >
                {{ $t("As Participant") }}
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </div>
      </template>
      <template v-else>
        <span class="control-text">{{ $t(title) }}</span>
      </template>
      <div class="ml-auto d-flex align-items-center">
        <template v-if="dataControl.dropdownShow === 'requests'">
          <div class="mr-4">
            <b-dropdown variant="outline-secondary" size="sm">
              <template #button-content>
                <span>
                  <b-icon
                    v-if="showBadge"
                    icon="circle-fill"
                    :variant="badgeVariant"
                  />
                  {{ $t(titleDropdown) }}
                </span>
              </template>
              <b-dropdown-item
                variant="success"
                @click="
                  handleDropdownSelection('requests_dropdown', 'In Progress')
                "
              >
                <i class="fas fa-circle mr-2" />{{ $t("In Progress") }}
              </b-dropdown-item>
              <b-dropdown-item
                variant="primary"
                @click="
                  handleDropdownSelection('requests_dropdown', 'Completed')
                "
              >
                <i class="fas fa-circle mr-2" />{{ $t("Completed") }}
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_dropdown', 'all')"
              >
                {{ $t("View All") }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <template v-if="dataControl.dropdownShow === 'tasks'">
          <div class="mr-4">
            <b-dropdown variant="outline-secondary" size="sm">
              <template #button-content>
                <span>
                  <b-icon
                    v-if="showBadge"
                    icon="circle-fill"
                    :variant="badgeVariant"
                  />
                  {{ $t(titleDropdown) }}
                </span>
              </template>
              <b-dropdown-item
                variant="warning"
                @click="handleDropdownSelection('tasks', 'In Progress')"
              >
                <i class="fas fa-circle mr-2" />{{ $t("In Progress") }}
              </b-dropdown-item>
              <b-dropdown-item
                variant="danger"
                @click="handleDropdownSelection('tasks', 'Overdue')"
              >
                <i class="fas fa-circle mr-2" />{{ $t("Overdue") }}
              </b-dropdown-item>
              <b-dropdown-item @click="handleDropdownSelection('tasks', 'all')">
                {{ $t("View All") }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <div>
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-outline-secondary border-0 mr-1"
              @click="toggleInput(dataControl.dropdownShow)"
            >
              <i class="fas fa-search" />
            </button>
            <input
              v-if="showInput"
              ref="input"
              v-model="searchCriteria"
              type="text"
              class="form-control narrow-input"
              @keyup.enter="performSearch(dataControl.dropdownShow)"
            />
            <button
              v-if="showInput"
              class="btn btn-clear"
              @click="clearSearch(dataControl.dropdownShow)"
            >
              <i class="fas fa-times" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="listOption !== 'Start New Request'">
        <b-link @click="openExternalLink">
          <i class="fas fa-external-link-alt custom-icon" />
        </b-link>
      </div>
    </div>
    <div class="card-body list-table">
      <template v-if="listOption === 'My Tasks'">
        <FormTasks @tasksCount="getData"></FormTasks>
      </template>
      <template v-if="listOption === 'My Requests'">
        <FormRequests @requestsCount="getData"></FormRequests>
      </template>
      <template v-if="listOption === 'Start New Request'">
        <FormNewRequest @startControl="getData"></FormNewRequest>
      </template>
    </div>
  </div>
</template>

<script>
import FormTasks from "./form-tasks.vue";
import FormRequests from "./form-requests.vue";
import FormNewRequest from "./form-new-request.vue";

export default {
  components: { FormTasks, FormRequests, FormNewRequest },
  mixins: [],
  props: ["listOption"],
  data() {
    return {
      optionRequest: "by_me",
      dropdownRequest: "In Progress",
      titleDropdown: "View All",
      viewAll: "View All",
      title: this.$t("List Table"),
      dataControl: {},
      searchCriteria: "",
      showInput: false,
      pmql: "",
      badgeVariant: "",
      typeSelected: "",
      showBadge: false,
      customStyle: {
        "border-radius": "8px"
      }
    };
  },
  watch: {
    listOption() {
      this.title = this.listOption;
      this.dataControl = {};
    }
  },
  mounted() {
    this.title = this.listOption;
  },
  methods: {
    getData(data) {
      this.dataControl = data.dataControls;
    },
    openExternalLink() {
      window.open(this.dataControl.url, "_blank");
    },
    handleDropdownSelection(listType, valueSelected) {
      const combinedFilter = [];
      this.typeSelected = listType;
      if (listType === "tasks") {
        this.$root.$emit("dropdownSelectionTask", valueSelected);
        this.titleDropdown =
          valueSelected === "all" ? this.viewAll : valueSelected;
        this.colorBadge();
      } else {
        if (listType === "requests_filter") {
          this.optionRequest = valueSelected;
          if (valueSelected === "by_me") {
            this.title = "Request Started By Me";
          }
          if (valueSelected === "as_participant") {
            this.title = "With Me as Participant";
          }
        }
        if (listType === "requests_dropdown") {
          this.titleDropdown =
            valueSelected === "all" ? this.viewAll : valueSelected;
          this.colorBadge();
          this.dropdownRequest = valueSelected;
        }
        combinedFilter.push(this.optionRequest);
        combinedFilter.push(this.dropdownRequest);
        this.$root.$emit("dropdownSelectionRequest", combinedFilter);
      }
    },
    /**
     * This boolean method shows or hide elements
     */
    toggleInput(listType) {
      if (this.showInput && this.searchCriteria !== "") {
        this.performSearch(listType);
      }
      this.showInput = !this.showInput;
    },
    /**
     * This method sends users's input criteria to filter specific tasks, requests, Start new Request
     */
    performSearch(listType) {
      this.pmql = `(fulltext LIKE "%${this.searchCriteria}%")`;
      if (listType === "tasks") {
        this.$root.$emit("searchTask", this.pmql);
      }
      if (listType === "requests") {
        this.$root.$emit("searchRequest", this.pmql);
      }
      if (listType === undefined) {
        this.$root.$emit("dropdownSelectionStart", `${this.searchCriteria}`);
      }
    },
    clearSearch(listType) {
      this.searchCriteria = "";
      this.toggleInput(listType);
    },
    /**
     * Set the badge's color of the filter selected
     */
    colorBadge() {
      if (this.titleDropdown === "In Progress") {
        if (this.typeSelected === "tasks") {
          this.badgeVariant = "warning";
        }
        if (this.typeSelected === "requests_dropdown") {
          this.badgeVariant = "success";
        }
        this.showBadge = true;
      }
      if (this.titleDropdown === "Overdue") {
        this.badgeVariant = "danger";
        this.showBadge = true;
      }
      if (this.titleDropdown === "Overdue") {
        this.badgeVariant = "danger";
        this.showBadge = true;
      }
      if (this.titleDropdown === "Completed") {
        this.badgeVariant = "primary";
        this.showBadge = true;
      }
      if (this.titleDropdown === "View All" || this.titleDropdown === "all") {
        this.badgeVariant = "";
        this.showBadge = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.prevent-interaction.form-list-table::after {
  content: attr(placeholder);
}

.avatar-text {
  display: inline-block;
  margin-right: 10px;
  color: white;
  font-family: "Open Sans", sans-serif;
  text-align: center;
  font-size: 15.832px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.317px;
}

.control-text {
  display: inline-block;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.28px;
  text-transform: uppercase;
}

.custom-icon {
  color: #6c8498;
}

.list-table {
  height: 300px;
  overflow: auto;
  background-color: #f9f9f9;
}

.btn-outline-secondary {
  border: none;
}
</style>
