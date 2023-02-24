import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule) {
      try {
        const isVisible = Boolean(Parser.evaluate(rule, this.getDataReference()));
        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
