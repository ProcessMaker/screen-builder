<template>
  <div>
    <label class="typo__label">{{ $t('Select Chart Type') }}</label>
    <multiselect
      v-model="selectedOption"
      :placeholder="$t('Select option')"
      label="title"
      :options="options"
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
      // when Multiselect option is selected, an event is emmited to notify my-custom-chart component
      window.ProcessMaker.EventBus.$emit("option-selected", newValue.title);
    }
  }
};
</script>
