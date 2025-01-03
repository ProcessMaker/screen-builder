export const MAX_MOBILE_WIDTH = 480;
export const originalDevicePixelRatio = window.devicePixelRatio;
export default {
  created() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  mounted() {
    this.$nextTick(() => {
      this.checkIfIsMobile();
    });
  },
  methods: {
    resizeHandler() {
      this.checkIfIsMobile();
    },
    checkIfIsMobile() {
      const renderer = document.getElementById("vue-form-renderer");
      const isModelerInspector = this.data && this.data.$type && this.data.$type.startsWith("bpmn:");
      if (this.definition && !isModelerInspector) {
        this.definition.isMobile =
          renderer &&
          renderer.offsetWidth <= MAX_MOBILE_WIDTH &&
          originalDevicePixelRatio === window.devicePixelRatio;
      }
    }
  }
};
