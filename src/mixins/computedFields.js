import { Parser } from "expr-eval";

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
          // eslint-disable-next-line no-new-func
          value = new Function(expression).bind(data)();
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }

        return value;
      } catch (e) {
        console.warn("There was a problem evaluating the expression", e);
      }
    }
  }
};
