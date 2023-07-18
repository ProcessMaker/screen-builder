import { Parser } from "expr-eval";

export default {
  methods: {
    visibilityRuleIsVisible(rule, name, deviceVisibility) {
      const visibility = deviceVisibility || {showForDesktop: true, showForMobile: true, isMobile: false};
      const visibleInDevice =
        (visibility.isMobile && visibility.showForMobile) ||
        (!visibility.isMobile && visibility.showForDesktop);

      try {
        if (rule && rule.trim().length > 0) {
          const dataWithParent = this.getDataReference();
          const isVisible = Boolean(Parser.evaluate(rule, dataWithParent));
          return isVisible && visibleInDevice;
        }
        return visibleInDevice;
      } catch (e) {
        return visibleInDevice;
      }
    }
  }
};
