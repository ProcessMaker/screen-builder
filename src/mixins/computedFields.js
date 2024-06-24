import { Parser } from "expr-eval";
import CustomLog from '../customLogs';

export default {
  methods: {
    evaluateExpression(expression, type) {
      let value = null;

      try {
        // Monitor if variable belongs to data (defined variables) or
        // vdata (external variables)in this way the event is not
        // executed again when the variable is update
        const data = this.getDataReference(null, () => {
          throw new Error(
            "You are not allowed to set properties from inside an expression"
          );
        });

        if (type === "expression") {
          value = Parser.evaluate(expression, data);
        } else {
          // Create a new function with the expression and bind the data context
          // eslint-disable-next-line no-new-func
          value = new Function(expression).bind(data);
          return { result: value(), error: null };
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }
        return { result: value, error: null };
      } catch (error) {
        // Catch any errors and return them
        return { result: null, error };
      }
    },
    /**
     * Logs an error message with a custom format.
     * @param {string} name - The name of the calculation.
     * @param {string} message - The error message.
     */
    customErrorLog(name, message) {
      CustomLog.error('Calc', name, message);
    },

    /**
     * Logs a success message with a custom format.
     * @param {string} name - The name of the calculation.
     */
    customSuccessLog(name) {
      CustomLog.success('Calc', name);
    },
  }
};
