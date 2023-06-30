export const MAX_MOBILE_WIDTH = 480;
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
      if (this.definition) {
        this.definition.isMobile =
          renderer && renderer.offsetWidth <= MAX_MOBILE_WIDTH;
      }
    }
  }
};