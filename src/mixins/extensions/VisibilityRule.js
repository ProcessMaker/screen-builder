import VisibilityRule from '../VisibilityRule';

export default {
  mounted() {
    this.extensions.push({
      onloaditems({ element, wrapper }) {
        const visibility = element.config.deviceVisibility || { showForDesktop: true, showForMobile: true }
        const restrictDeviceVisibility = !visibility.showForDesktop || !visibility.showForMobile;

        if (element.config.conditionalHide || restrictDeviceVisibility) {
          const deviceVisibility = JSON.stringify(visibility);
          wrapper.setAttribute(
            'v-show',
            `visibilityRuleIsVisible(${JSON.stringify(element.config.conditionalHide)}, 
            ${JSON.stringify(element.config.name)}, ${deviceVisibility}, isMobile)`
          );
        }
      },
      onbuild({ screen }) {
        this.addProp(screen, "isMobile", {
          type: Boolean,
          default: false,
        });
        this.addWatch(screen, "isMobile", "this.loadValidationRules();");
        screen.mixins.push(VisibilityRule);
      },
    });
  },
};
