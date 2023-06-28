import VisibilityRule from '../VisibilityRule';

export default {
  mounted() {
    this.extensions.push({
      onloaditems({ element, wrapper, definition }) {
        const visibility = element.config.deviceVisibility || { showForDesktop: true, showForMobile: true }
        const restrictDeviceVisibility = !visibility.showForDesktop || !visibility.showForMobile;

        if (element.config.conditionalHide || restrictDeviceVisibility) {
          const deviceVisibility = JSON.stringify( { ...visibility, isMobile: definition.isMobile } );
          wrapper.setAttribute(
            'v-show',
            `visibilityRuleIsVisible(${JSON.stringify(element.config.conditionalHide)}, 
            ${JSON.stringify(element.config.name)}, ${deviceVisibility})`
          );
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(VisibilityRule);
      },
    });
  },
};
