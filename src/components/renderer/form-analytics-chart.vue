<template>
  <div class="card" :style="customStyle">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="mb-2 mt-2 control-text">{{ title }}</span>
      <b-link @click="openExternalLink">
        <i class="fas fa-external-link-alt custom-icon" />
      </b-link>
    </div>
    <div>
      <div class="d-flex flex-wrap p-2">
        <b-col cols="12">
          <b-card-text>
            <b-embed v-if="!showChart" type="iframe" :src="graphic.link"></b-embed>
            <img v-else src="../../assets/welcome_default.png" :style="{width:'100%', aspectRatio:21/9}" :alt="$t('Welcome Default')" />
          </b-card-text>
        </b-col>
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
      graphic: [],
      customStyle: {
        "border-radius": "8px"
      },
      showChart: false,
    };
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
    this.verifyChart();
  },
  methods: {
    openExternalLink() {
      window.open("/package-analytics-reporting", "_blank");
    },
    verifyChart() {
      this.showChart = this.graphic.name === "PM Analytics Chart" || this.graphic.name === "PM Analytics Dashboard" || this.graphic.length === 0;
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
