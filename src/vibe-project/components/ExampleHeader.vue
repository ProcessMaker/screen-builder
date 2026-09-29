<template>
  <header class="example-header p-3">
    <h1 class="example-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="example-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script>
export default {
  name: "ExampleHeader",
  props: {
    title: {
      type: String,
      default: "Screen",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.example-header {
  margin-bottom: 28px;
}

.example-header__title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  color: #1e1b4b;
  letter-spacing: -0.03em;
}

.example-header__subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}
</style>
