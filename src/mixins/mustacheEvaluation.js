import _ from 'lodash';
import Mustache from 'mustache';

export default {
  methods: {
    mustache(expression, data) {
      const value = _.get(data, expression);
      try {
        return value === undefined ? Mustache.render(expression, data) : value;
      } catch (error) {
        return expression;
      }
    },
  },
};
