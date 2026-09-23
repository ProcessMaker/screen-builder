import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule, name, deviceVisibility, isMobile = false) {
      const visibility = deviceVisibility || { showForDesktop: true, showForMobile: true };
      const visibleInDevice =
        (isMobile && visibility.showForMobile) || (!isMobile && visibility.showForDesktop);

      try {
        if (rule && rule.trim().length > 0) {
          const dataWithParent = this.getDataReference();
          const isVisible = Boolean(Parser.evaluate(rule, dataWithParent));

          return isVisible && visibleInDevice;
        }

        return visibleInDevice;
      } catch (e) {
        // empty.
      }

      return false;
    }
  }
};
