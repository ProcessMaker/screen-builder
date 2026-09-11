export const MAX_MOBILE_WIDTH = 480;
export const originalDevicePixelRatio = window.devicePixelRatio;
export default {
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detectedIsMobile: false
    };
  },
  computed: {
    responsiveIsMobile() {
      return this.isMobile || this.detectedIsMobile;
    }
  },
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
      const renderer = this.$refs.formRendererContainer;
      const isModelerInspector = this.data && this.data.$type && this.data.$type.startsWith("bpmn:");
      if (!isModelerInspector) {
        this.detectedIsMobile =
          renderer &&
          renderer.offsetWidth <= MAX_MOBILE_WIDTH &&
          originalDevicePixelRatio === window.devicePixelRatio;
      }
    }
  }
};
