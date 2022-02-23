import _ from 'lodash';
import { Parser } from 'expr-eval';

export default {
  methods: {
    evaluateExpression(expression, type) {
      let value = null;

      const self = this;

      try {
        // 'this' will be used in the Proxy, to have the correct data will add to it all the vdata
        // excluding the computed properties (to avoid circular references)
        for (const attr in this.vdata) {
          if (!_.has(this._computedWatchers, attr)) {
            this[attr] = this.vdata[attr];
          }
        }

        //monitor if variable belongs to data (defined variables) or vdata (external variables)
        //in this way the event is not executed again when the variable is update
        const data = new Proxy(Object.assign({}, this), {
          get(data, name) {
            if (data[name] === undefined) {
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
