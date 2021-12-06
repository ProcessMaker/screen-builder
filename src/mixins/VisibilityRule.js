import { Parser } from 'expr-eval';
import { debounce } from 'lodash';

export default {
  mounted() {
    this.refreshValidationRulesByName = debounce(this.refreshValidationRulesByName, 1000);

    this.$root.$on('refresh-validation-rules', () => {
      this.loadValidationRules();
    });
  },
  methods: {
    refreshValidationRulesByName(fieldName, isVisible) {
      if (fieldName) {
        // Update the array of hidden fields
        const fieldExists = this.hiddenFields__.indexOf(fieldName) !== -1;
        if (isVisible && fieldExists) {
          this.hiddenFields__ = this.hiddenFields__.filter((f) => f !== fieldName);
        } else if (!isVisible && !fieldExists) {
          this.hiddenFields__.push(fieldName);
        }
      }
      this.$root.$emit('refresh-validation-rules');
    },

    visibilityRuleIsVisible(rule, fieldName) {
      try {
        const data = Object.assign({ _parent: this._parent }, this.vdata);
        const isVisible = !!Parser.evaluate(rule, Object.assign({}, data));

        window.setTimeout(() => {
          this.refreshValidationRulesByName(fieldName, isVisible);
        }, 1000);
        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
