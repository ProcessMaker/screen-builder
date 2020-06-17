export default {
  methods: {
    pageNavigate(page) {
      this.currentPage__ = page;
    },
    pageNavigationProperties({ properties }) {
      properties['@page-navigate'] = 'pageNavigate';
    },
    pageNavigationBuild(screen) {
      this.addData(screen, 'currentPage__', '0');
      screen.methods.pageNavigate = function(page) {
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
      onbuild(screen) {
        this.pageNavigationBuild(screen);
      },
    });
  },
};
