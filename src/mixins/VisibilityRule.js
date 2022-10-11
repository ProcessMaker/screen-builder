import { Parser } from 'expr-eval';

export default {
  methods: {
    visibilityRuleIsVisible(rule) {
      try {
        const that = this;
        const dataWithParent = new Proxy(
          {},
          {
            get: (target, name) => {
              if (name === "_parent") {
                return that._parent;
              }
              return that.vdata[name];
            },
            has: (target, name) => {
              if (name === "_parent") {
                return that._parent !== undefined;
              }
              return that.vdata[name] !== undefined;
            }
          }
        );
        const isVisible = Boolean(Parser.evaluate(rule, dataWithParent));
        return isVisible;
      } catch (e) {
        return false;
      }
    },
  },
};
