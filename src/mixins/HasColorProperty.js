
export default {
  methods: {
    elementCssClass(element) {
      const css = [];
      element.config.bgcolor ? css.push(element.config.bgcolor) : null;
      element.config.color ? css.push(element.config.color) : null;
      element.config.bgcolormodern ? css.push(element.config.bgcolormodern) : null;
      return css.join(' ');
    },
    elementCssClassModern(element) {
      const css = [];
      element.config.bgcolormodern ? css.push(element.config.bgcolormodern) : null;
      return css.join(' ');
    }
  },
};

