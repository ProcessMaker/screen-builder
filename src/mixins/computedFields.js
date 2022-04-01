import { isEqual } from 'lodash';
import { Parser } from 'expr-eval';

export default {
  methods: {
    evaluateExpression(expression, type) {
      const self = this;
      let value = null;

      try {
        // Monitor if variable belongs to data (defined variables) or
        // vdata (external variables)in this way the event is not
        // executed again when the variable is update

        const data = new Proxy(Object.assign({}, this), {
          get(data, name) {
            if (data[name] === undefined || !isEqual(data[name]), self.vdata[name]) {
              return self.vdata[name];
            } else {
              return data[name];
            }
          },
          set() {
            throw 'You are not allowed to set properties from inside an expression';
          },
        });

        if (type === 'expression') {
          value = Parser.evaluate(expression, data);
        } else {
          value = new Function(expression).bind(data)();
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
