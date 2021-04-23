export default {
  methods: {
    /* istanbul ignore next */
    pageNavigate() {},
    pageNavigationProperties({ properties }) {
      properties['@page-navigate'] = 'pageNavigate';
    },
    pageNavigationBuild(screen) {
      this.addData(screen, 'currentPage__', 'this._initialPage');
      screen.methods.pageNavigate = function(page) {
        // Skip navigate button if page is not defined
        if (!this.$parent.definition.config[page]) {
          return;
        }
        this.currentPage__ = page;
      };
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (params.componentName === 'FormButton') {
          this.pageNavigationProperties(params);
        }
      },
      onbuild({ screen }) {
        this.pageNavigationBuild(screen);
      },
    });
  },
};
