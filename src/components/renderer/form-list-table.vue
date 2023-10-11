<template>
  <div class="card mt-4 mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <template v-if="dataControl.showControl">
        <div class="mb-2">
          <b-avatar
            v-if="dataControl.showAvatar"
            size="2em"
            :variant="dataControl.variant"
            :text="dataControl.count"
            class="avatar-text"
          ></b-avatar>
          <p class="control-text" :style="dataControl.colorText">
            {{ title }}
          </p>
        </div>
      </template>
      <template v-else>
        <p class="control-text">
          {{ title }}
        </p>
      </template>
      <div class="ml-auto d-flex align-items-center">
        <template v-if="dataControl.dropdownShow === 'requests'">
          <div class="mr-4">
            <b-dropdown variant="secondary" size="sm">
              <template #button-content>
                <span>View All</span>
              </template>
              <b-dropdown-item variant="warning">
                <i class="fas fa-circle mr-2"></i>In Progress
              </b-dropdown-item>
              <b-dropdown-item variant="success">
                <i class="fas fa-circle mr-2"></i>Completed
              </b-dropdown-item>
              <b-dropdown-item>View All</b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <template v-if="dataControl.dropdownShow === 'tasks'">
          <div class="mr-4">
            <b-dropdown variant="secondary" size="sm">
              <template #button-content>
                <span>View All</span>
              </template>
              <AvatarDropdown
                :variant="'warning'"
                :text="countInProgress"
                :label="'In Progress'"
              ></AvatarDropdown>
              <AvatarDropdown
                :variant="'danger'"
                :text="countOverdue"
                :label="'Overdue'"
              ></AvatarDropdown>
              <b-dropdown-item>View All</b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <div>
          <i class="fas fa-search custom-icon ml-2"></i>
        </div>
      </div>
      <div>
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
      <template v-if="listOption === 'Start new Request'">
        <FormNewRequest @startControl="getData"></FormNewRequest>
      </template>
    </div>
  </div>
</template>

<script>
import FormTasks from "./form-tasks.vue";
import FormRequests from "./form-requests.vue";
import FormNewRequest from "./form-new-request.vue";
import AvatarDropdown from "./avatar-dropdown.vue";

export default {
  components: { FormTasks, FormRequests, FormNewRequest, AvatarDropdown },
  mixins: [],
  props: ["listOption"],
  data() {
    return {
      countInProgress: "0",
      countOverdue: "0",
      selectedOptionStatus: "In Progress",
      selectedIconStatus: "fas fa-circle text-warning",
      title: this.$t("List Table"),
      dataControl: {}
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
    // this.fetch();
  },
  methods: {
    getData(data) {
      this.dataControl = data;
    },
    openExternalLink() {
      window.open(this.dataControl.url, "_blank");
    },
    fetch() {
      // Load from our api client
      ProcessMaker.apiClient
        .get(
          `tasks?page=${this.page}&include=process,processRequest,processRequest.user,user,data` +
            `&per_page=10&non_system=true`
        )
        .then((response) => {
          this.countInProgress = `${Object.keys(response.data).length}`;
        })
        .catch(() => {
          this.countInProgress = "0";
        });
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
  /* Cambia esto al color que desees */
}

.list-table {
  height: 300px;
  overflow: auto;
}
</style>
