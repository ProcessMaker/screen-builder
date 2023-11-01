<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <span class="control-text">{{ title }}</span>
        <b-link @click="openExternalLink">
          <i class="fas fa-external-link-alt custom-icon" />
        </b-link>
      </div>
      <div>
        <div class="d-flex flex-wrap p-2">
          <template>
            <b-col cols="12">
              <b-card-text>
                <b-embed type="iframe" :src="graphic.link"></b-embed>
              </b-card-text>
            </b-col>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["listChartOption"],
  data() {
    return {
      title: this.$t("Analytics Chart"),
      graphic: []
    };
  },
  methods: {
    openExternalLink() {
      window.open("/package-analytics-reporting", "_blank");
    }
  },
  watch: {
    listChartOption() {
      if (this.listChartOption && this.listChartOption.name) {
        this.graphic = this.listChartOption;
      }
    }
  },
  mounted() {
    if (this.listChartOption && this.listChartOption.name) {
      this.graphic = this.listChartOption;
    }
  }
};
</script>

<style lang="scss" scoped>
.prevent-interaction.form-analytics-chart::after {
  content: attr(placeholder);
}
.card-graphic {
  max-width: 560px;
}
.graphic-description {
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.control-text {
  display: inline-block;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.28px;
  text-transform: uppercase;
}
</style>
