<template>
  <div class="card mt-4 mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h4>{{ title }}</h4>
      <div>
        <i class="fas fa-search" />
      </div>
    </div>
    <div class="card-body list-table">
      <template v-if="listOption === 'My Tasks'">
        <FormTasks></FormTasks>
      </template>
      <template v-if="listOption === 'My Requests'">
        <FormRequests></FormRequests>
      </template>
      <template v-if="listOption === 'Start new Request'">
        <FormNewRequest></FormNewRequest>
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
      title: this.$t("List Table")
    };
  },
  watch: {
    listOption() {
      this.title = this.listOption;
    }
  },
  mounted() {
    this.title = this.listOption;
  },
  methods: {}
};
</script>

<style lang="scss">
.prevent-interaction.form-list-table::after {
  content: attr(placeholder);
}
.list-table {
  height: 300px;
  overflow: auto;
}
</style>
