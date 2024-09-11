<template>
    <!-- Conditionally render buttons based on clipboardContent -->
    <button
      v-if="isInClipboard"
      class="btn btn-sm btn-outline-secondary mr-2 remove-btn"
      :title="removeTitle"
      @click="removeFromClipboard"
      data-cy="removeFromClipboard"
    >
      <i class="fas fa-minus"></i>
    </button>

    <button
      v-else
      class="btn btn-sm btn-success mr-2 add-btn"
      :title="addTitle"
      @click="addToClipboard(index)"
      data-cy="addToClipboard"
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
      addTitle: this.$t('Add to clipboard'),
      removeTitle: this.$t('Remove from clipboard'),
    };
  },

  methods: {
    // Method to handle adding to clipboard
    addToClipboard(index) {
      this.$emit('addToClipboard');
    },
    // Method to handle removing from clipboard
    removeFromClipboard() {
      this.$emit('removeFromClipboard');
    },
  },
};
</script>

<style scoped>
.remove-btn {
  background-color: #FFFFFF;
  color: #596372;
}
.remove-btn:hover {
  background-color: #f8f9fa; 
  color: #596372;
}
.add-btn {
  background-color: #0CA442;
}
</style>
