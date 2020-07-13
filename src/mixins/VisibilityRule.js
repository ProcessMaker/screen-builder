import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule) {
      return !!Parser.evaluate(rule, Object.assign({}, this, this.vdata));
    },
  },
};
