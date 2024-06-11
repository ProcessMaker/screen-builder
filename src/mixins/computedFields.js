import { Parser } from "expr-eval";

export default {
  methods: {
    evaluateExpression(expression, type) {
      let value = null;

      try {
        // Monitor if variable belongs to data (defined variables) or
        // vdata (external variables)in this way the event is not
        // executed again when the variable is update
        console.log('start, evaluateExpression!');
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
          const func = new Function(expression).bind(data);
          // value = new Function(expression).bind(data)();
          return { result: func(), error: null };
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }
        console.log('end-evaluateExpression!');
        return value;
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
      // Unicode character for the common error icon
      const errorIcon = "\u274C"; // Heavy multiplication X
      // Create the error message with a background similar to console.error
      const style =
        "background-color: rgba(255, 0, 0, 0.1); color: red; padding: 2px 4px; border-radius: 3px;";
      // start console log group
      console.groupCollapsed(
        `%c${errorIcon} %cCalc "${name}" has %cFailed`,
        style,
        "background-color: rgba(255, 0, 0, 0.1)",
        style
      );
      // Log the message
      console.log(`%c${message}`, style);
      // End the console group
      console.groupEnd();
    },

    /**
     * Logs a success message with a custom format.
     * @param {string} name - The name of the calculation.
     */
    customSuccessLog(name) {
      // Unicode character for the success icon
      const successIcon = "\u2705"; // Checkmark
      // Create the success message with a green background
      const style =
        "background-color: rgba(0, 128, 0, 0.1); color: green; padding: 1px 1px; border-radius: 3px;";
      // Log the styled success message with an icon
      console.log(
        `%c${successIcon} %cCalc "${name}" has %cRUN`,
        style,
        "background-color: rgba(0, 128, 0, 0.1)",
        style
      );
    }
  }
};
