<template>
  <div>
    <label class="typo__label">{{ $t("Analytics Management") }}</label>
    <multiselect
      v-model="selectedOption"
      :placeholder="$t('Select Chart')"
      :internal-search="false"
      :show-labels="false"
      :options="formattedOptions"
      label="name"
      track-by="link"
      :multiple="false"
      :allow-empty="false"
    />
  </div>
</template>

<script>
const globalObject = typeof window === "undefined" ? global : window;

export default {
  props: ["value"],
  data() {
    return {
      selectedOption: null,
      formattedOptions: [{ name: "", link: "" }]
    };
  },
  watch: {
    selectedOption(newValue) {
      this.$emit("input", newValue);
    },
    value() {
      this.selectedOption = this.value;
    }
  },
  mounted() {
    this.fetchChartData();
    this.selectedOption = this.value;
  },
  methods: {
    fetchChartData() {
      try {
        ProcessMaker.apiClient
          .get(`analytics-reporting-all`)
          .then((response) => {
            this.formattedOptions = response.data.data.map((item) => ({
              name: item.name,
              link: item.link
            }));
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }
};
</script>
