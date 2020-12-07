export default {
  props: {
    currentPage: null,
  },
  methods: {
    updateCurrentPage() {
      if (this.currentPage!==undefined && this.currentPage!==null) {
        this.setCurrentPage(this.currentPage);
      }
    },
  },
  watch: {
    currentPage() {
      this.updateCurrentPage();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateCurrentPage();
    });
  },
};
