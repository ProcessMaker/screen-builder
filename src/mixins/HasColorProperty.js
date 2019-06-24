
export default {
  methods: {
    elementCssClass(element) {
      const css = [];
      element.config.bgcolor ? css.push(element.config.bgcolor) : null;
      element.config.color ? css.push(element.config.color) : null;
      return css.join(' ');
    },
  },
};

