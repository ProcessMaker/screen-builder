<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>{{ title }}</h4>
        <div>
          <i class="fas fa-search"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="text-center">
          <i class="far fa-list-alt fa-5x"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialTitle: String
  },
  data() {
    return {
      title: this.initialTitle || "Custom Control"
    };
  }
};
</script>

<style lang="scss">
.prevent-interaction.form-my-custom-chart::after {
  content: attr(placeholder);
}
</style>
