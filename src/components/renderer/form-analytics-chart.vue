<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>{{ title }}</h4>
        <div>
          <i class="fas fa-search" />
        </div>
      </div>
      <div>
        <div class="d-flex flex-wrap p-2">
          <template>
            <b-col cols="12">
              <b-card
                :title="graphic.name"
                img-top
                tag="article"
                class="mb-0 mr-0 card-graphic"
              >
                <b-card-text>
                  <b-embed type="iframe" :src="graphic.link"></b-embed>
                </b-card-text>
              </b-card>
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
</style>
