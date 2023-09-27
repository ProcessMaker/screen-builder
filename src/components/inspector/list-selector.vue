<template>
  <div>
    <label class="typo__label">{{ $t("Select Chart Type") }}</label>
    <multiselect
      v-model="selectedOption"
      :placeholder="$t('Select option')"
      :internal-search="false"
      :show-labels="false"
      :options="options"
      label="title"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: null,
      options: [
        { title: this.$t("My Tasks") },
        { title: this.$t("My Requests") },
        { title: this.$t("Start new Request") }
      ]
    };
  },
  watch: {
    selectedOption(newValue) {
      // when Multiselect option is selected, an event is emmited to notify form-list-table component
      window.ProcessMaker.EventBus.$emit("option-selected", newValue.title);
    }
  }
};
</script>
