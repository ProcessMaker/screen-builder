export default {
  mounted() {
    this.extensions.push({
      onloaditems({ element, wrapper }) {
        if (element.config.customCssSelector) {
          wrapper.setAttribute('selector', element.config.customCssSelector);
        }
      },
    });
  },
};
