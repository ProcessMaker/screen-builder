<template>
    <!-- Conditionally render buttons based on clipboardContent -->
    <button
      v-if="isInClipboard"
      class="btn btn-sm btn-outline-secondary mr-2"
      :title="removeTitle"
      :style="removeButtonStyle"
      @click="removeFromClipboard"
    >
      <i class="fas fa-minus"></i>
    </button>

    <button
      v-else
      class="btn btn-sm btn-success mr-2"
      :title="addTitle"
      @click="addToClipboard(index)"
    >
      <i class="fas fa-plus"></i>
    </button>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    isInClipboard: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      addTitle: 'Add to clipboard',
      removeTitle: 'Remove from clipboard',
      removeButtonStyle: {
        backgroundColor: '#FFFFFF',
      },
    };
  },

  methods: {
    // Method to handle adding to clipboard
    addToClipboard(index) {
      this.$emit('addToClipboard', index);
    },
    // Method to handle removing from clipboard
    removeFromClipboard() {
      this.$emit('remove-from-clipboard');
    },
  },
};
</script>

<style scoped>
/* Add any specific styles here */
</style>
