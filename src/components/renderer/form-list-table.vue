<template>
  <div class="card" :style="customStyle">
    <div class="card-header d-flex justify-content-between align-items-center">
      <template v-if="dataControl.showControl">
        <div class="head-filter">
          <b-badge class="badge-custom" pill :variant="dataControl.variant">
            {{ dataControl.count }}
          </b-badge>
          <p class="control-text mb-0" :style="dataControl.colorText">
            {{ $t(title) }}
          </p>
          <template v-if="dataControl.dropdownShow === 'requests'">
            <b-dropdown
              variant="outline-secondary"
              right
              no-caret
            >
              <template #button-content>
                <i class="fas fa-caret-down" />
              </template>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_filter', 'by_me')"
              >
                <span class="item-text">
                  {{ $t("As Requester") }}
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_filter', 'as_participant')"
              >
                <span class="item-text">
                  {{ $t("As Participant") }}
                </span>
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
            <b-dropdown
              variant="outline-secondary"
              size="sm"
            >
              <template #button-content>
                <span class="text-capitalize">
                  <b-icon
                    v-if="showBadge"
                    icon="circle-fill"
                    class="mr-2"
                    :variant="badgeVariant"
                  />
                  {{ $t(titleDropdown) }}
                </span>
              </template>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_dropdown', 'all')"
              >
                <span class="item-text">
                  {{ $t("View All") }}
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_dropdown', 'Completed')"
              >
                <span class="item-text">
                  <i
                    class="fas fa-circle mr-2 text-primary" 
                  />
                  {{ $t("Completed") }}
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('requests_dropdown', 'In Progress')"
              >
                <span class="item-text">
                  <i
                    class="fas fa-circle mr-2 text-success"
                  />
                  {{ $t("In Progress") }}
                </span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <template v-if="dataControl.dropdownShow === 'tasks'">
          <div class="mr-4">
            <b-dropdown
              variant="outline-secondary"
              size="sm"
            >
              <template #button-content>
                <span class="text-capitalize">
                  <b-icon
                    v-if="showBadge"
                    icon="circle-fill"
                    class="mr-2"
                    :variant="badgeVariant"
                  />
                  {{ $t(titleDropdown) }}
                </span>
              </template>
              <b-dropdown-item @click="handleDropdownSelection('tasks', 'all')">
                <span class="item-text">
                  {{ $t("View All") }}
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('tasks', 'Overdue')"
              >
                <span class="item-text">
                <i
                  class="fas fa-circle mr-2 text-danger"
                />
                {{ $t("Overdue") }}
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="handleDropdownSelection('tasks', 'In Progress')"
              >
                <span class="item-text">
                  <i
                    class="fas fa-circle mr-2 text-warning"
                  />
                  {{ $t("In Progress") }}
                </span>
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
      <template v-if="verifyListCase()">
        <FormRequests @requestsCount="getData"></FormRequests>
      </template>
      <template v-if="verifyNewCase()">
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
      this.title = this.checkTitle(this.listOption);
      this.dataControl = {};
    }
  },
  mounted() {
    this.title = this.checkTitle(this.listOption);
  },
  methods: {
    /**
     * Backward compatibility beacuse value is used as title
     */
    checkTitle(option) {
      if (option === "Start New Request") {
        return "Start New Case";
      }
      if (option === "My Requests") {
        return "My Cases";
      }
      return option;
    },
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
            this.title = "Cases Started By Me";
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
      this.performSearch(listType);
      this.showInput = !this.showInput;
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
    },
    /**
     * Verify backward compatibility for Start New Case
     */
    verifyNewCase() {
      return (
        this.listOption === "Start New Case" ||
        this.listOption === "Start New Request"
      );
    },
    /**
     * Verify backward compatibility for List Cases
     */
    verifyListCase() {
      return (
        this.listOption === "My Cases" || this.listOption === "My Requests"
      );
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

.item-text {
  color: #42526E;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: -0.02em;
  text-align: left;
}

.dropdown-menu {
  padding: 10px;
  width: 211px;
  box-shadow: 0px 10px 20px 4px #00000021;
}

.dropdown-item {
  padding: 10px 8px;
}
.head-filter {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.badge {
  display: inline-flex;
  padding: 8px;
  height: 24px;
  align-items: center;
}
</style>
