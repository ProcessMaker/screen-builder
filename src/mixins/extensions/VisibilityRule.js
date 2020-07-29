import VisibilityRule from '../VisibilityRule';

export default {
  mounted() {
    this.extensions.push({
      onloaditems({ element, wrapper }) {
        if (element.config.conditionalHide) {
          wrapper.setAttribute('v-show', `visibilityRuleIsVisible(${JSON.stringify(element.config.conditionalHide)})`);
        }
      },
      onbuild(screen) {
        screen.mixins.push(VisibilityRule);
      },
    });
  },
};
