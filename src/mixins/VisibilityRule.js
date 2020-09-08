import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule) {
      try {
        return !!Parser.evaluate(rule, Object.assign({}, this, this.vdata));
      } catch (e) {
        return false;
      }
    },
  },
};
