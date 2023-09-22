<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>{{ title }}</h4>
        <div>
          <i class="fas fa-search" />
        </div>
      </div>
      <div class="card-body">
        <div class="text-center">
          <i class="far fa-list-alt fa-5x" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$t("Custom Control") // Default Control Title
    };
  },
  created() {
    window.ProcessMaker.EventBus.$on("option-selected", (option) => {
      // Title is updated when event is received
      this.title = option;
    });
  }
};
</script>

<style lang="scss">
.prevent-interaction.form-my-custom-chart::after {
  content: attr(placeholder);
}
</style>
