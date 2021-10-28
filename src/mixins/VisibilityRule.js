import { Parser } from 'expr-eval';
import { debounce } from 'lodash';

export default {
  mounted() {
    this.refreshValidationRulesByName = debounce(this.refreshValidationRulesByName, 300);

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

        // Update the array of hidden fields
        if (fieldName) {
          const fieldExists = this.hiddenFields__.indexOf(fieldName) !== -1;
          if (isVisible && fieldExists) {
            this.hiddenFields__ = this.hiddenFields__.filter((f) => f !== fieldName);
            this.$root.$emit('refresh-validation-rules');
          } else if (!isVisible && !fieldExists) {
            this.hiddenFields__.push(fieldName);
            this.$root.$emit('refresh-validation-rules');
          }
        }
        

        this.refreshValidationRulesByName(fieldName, isVisible);
        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
