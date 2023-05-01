import Mustache from 'mustache';
import { get } from "lodash-es";

export default {
  methods: {
    mustache(expression, data) {
      const value = get(data, expression);
      try {
        return expression.indexOf('{{') > -1 ? Mustache.render(expression, data) : value;
      } catch (error) {
        return value;
      }
    },
  },
};
