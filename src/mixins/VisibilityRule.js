import { Parser } from 'expr-eval';

export default {
  mounted() {
    this.$root.$on('refresh-validation-rules', () => {
      this.loadValidationRules();
    });
  },
  methods: {
    visibilityRuleIsVisible(rule, fieldName) {
      try {
        const data = Object.assign({ _parent: this._parent }, this.vdata);
        const isVisible = !!Parser.evaluate(rule, Object.assign({}, this, data));

        // Update the array of hidden fields
        const fieldExists = this.hiddenFields__.indexOf(fieldName) !== -1;
        if (isVisible && fieldExists) {
          this.hiddenFields__ = this.hiddenFields__.filter((f) => f !== fieldName);
          this.$root.$emit('refresh-validation-rules');
        } else if (!isVisible && !fieldExists) {
          this.hiddenFields__.push(fieldName);
          this.$root.$emit('refresh-validation-rules');
        }

        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
