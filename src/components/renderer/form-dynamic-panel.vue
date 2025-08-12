<template>
  <div>
    <div v-if="itemData">
      <slot></slot>
    </div>
    <div v-else class="dynamic-panel-empty">
      <div v-html="renderedEmptyMessage" class="text-muted"></div>
    </div>
  </div>
</template>

<script>
import Mustache from 'mustache';

export default {
  name: "FormDynamicPanel",
  props: {
    itemData: {
      type: [Object, Array, String, Number, Boolean],
      required: false,
      default: null
    },
    emptyStateMessage: {
      type: String,
      required: false,
      default: 'No data available for this dynamic panel'
    },
    validationData: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    hasData() {
      return this.itemData !== null && this.itemData !== undefined;
    },
    renderedEmptyMessage() {
      if (!this.emptyStateMessage) {
        return this.$t('No data available for this dynamic panel');
      }

      try {
        // Process Mustache placeholders
        const processedMessage = Mustache.render(this.emptyStateMessage, this.validationData);
        return processedMessage;
      } catch (error) {
        // If Mustache processing fails, return the original message
        return this.emptyStateMessage;
      }
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
