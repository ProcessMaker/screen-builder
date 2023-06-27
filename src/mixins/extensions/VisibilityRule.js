import VisibilityRule from '../VisibilityRule';

export default {
  mounted() {
    this.extensions.push({
      onloaditems({ element, wrapper, definition }) {
        // TODO remove log
        console.log('element:', definition.isMobile);
        if (element.config.conditionalHide) {
          wrapper.setAttribute(
            'v-show',
            `visibilityRuleIsVisible(${JSON.stringify(element.config.conditionalHide)}, 
            ${JSON.stringify(element.config.name)})`
          );
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(VisibilityRule);
      },
    });
  },
};
