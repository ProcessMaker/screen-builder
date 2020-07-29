/* istanbul ignore file */
import { Parser } from 'expr-eval';

export default {
  methods: {
    shouldElementBeVisible(element) {
      const { conditionalHide } = element.config;

      if (!conditionalHide) {
        return true;
      }

      try {
        return !!Parser.evaluate(conditionalHide, this.transientData);
      } catch (error) {
        return false;
      }
    },
  },
};
