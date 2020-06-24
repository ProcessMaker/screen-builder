import { Parser } from 'expr-eval';

export default {
  methods: {
    evaluateExpression(expression) {
      return Parser.evaluate(expression, this);
    },
  },
};
