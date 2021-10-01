import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule, fieldName) {
      try {
        const data = Object.assign({ _parent: this._parent }, this.vdata);
        const isVisible = !!Parser.evaluate(rule, Object.assign({}, this, data));
        
        // Update the array of hidden fields
        const fileExists = this.hiddenFields__.indexOf(fieldName) !== -1;
        if (isVisible && fileExists) {
          this.hiddenFields__ = this.hiddenFields__.filter((f) => f !== fieldName);
        } else if (!isVisible && !fileExists) {
          this.hiddenFields__.push(fieldName);
        }

        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
