<template>
  <div>
    <div v-if="itemData">
      <slot></slot>
    </div>
    <div v-else class="dynamic-panel-empty">
      <p class="text-muted">No data available for this dynamic panel</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "FormDynamicPanel",
  props: {
    itemData: {
      type: [Object, Array, String, Number, Boolean],
      required: false,
      default: null
    },
  },
  computed: {
    hasData() {
      return this.itemData !== null && this.itemData !== undefined;
    }
  }
};
</script>

<style scoped>

.dynamic-panel-empty {
  text-align: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.dynamic-panel-empty p {
  margin-bottom: 8px;
}
</style>
