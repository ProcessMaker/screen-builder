import { Parser } from 'expr-eval';

export default {
  methods: {
    evaluateExpression(expression, type) {
      let value = null;
      try {
        if (type === 'expression') {
          value = Parser.evaluate(expression, Object.assign({}, this, this.vdata));
        } else {
          value = new Function(expression).bind(Object.assign({}, this, this.vdata))();
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }

        return value;

      } catch (e) {
        e;
      }
    },
  },
};
