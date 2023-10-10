<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
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
        <div>
          <i class="fas fa-search" />
        </div>
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

export default {
  components: { FormTasks, FormRequests, FormNewRequest },
  mixins: [],
  props: ["listOption"],
  data() {
    return {
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
  },
  methods: {
    getData(data) {
      this.dataControl = data;
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
