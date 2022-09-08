import { Parser } from 'expr-eval';

export default {

  methods: {
    visibilityRuleIsVisible(rule) {
      try {
        const data = Object.assign({ _parent: this._parent }, this.vdata);
        const isVisible = !!Parser.evaluate(rule, Object.assign({}, data));

        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
