import { Parser } from "expr-eval";

export default {
  methods: {
    visibilityRuleIsVisible(rule) {
      try {
        const dataWithParent = this.getDataReference();
        const isVisible = Boolean(Parser.evaluate(rule, dataWithParent));
        return isVisible;
      } catch (e) {
        return false;
      }
    }
  }
};
