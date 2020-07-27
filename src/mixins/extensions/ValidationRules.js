import { set, get } from 'lodash';
import { validationMixin } from 'vuelidate';
import {
  required,
  requiredIf,
  requiredUnless,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  alpha,
  alphaNum,
  numeric,
  integer,
  decimal,
  email,
  ipAddress,
  macAddress,
  sameAs,
  url,
  not,
  or,
  and,
} from 'vuelidate/lib/validators';

const validators = {
  required,
  requiredIf,
  requiredUnless,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  alpha,
  alphaNum,
  numeric,
  integer,
  decimal,
  email,
  ipAddress,
  macAddress,
  sameAs,
  same: sameAs,
  url,
  not,
  or,
  and,
};
function locatorABParam(a, b) {
  return function() {
    return this.getValue(a, this) == b;
  };
}
function locatorAParam(a) {
  return function() {
    return this.getValue(a, this);
  };
}
const validationsWithLocator = {
  requiredIf: locatorABParam,
  requiredUnless: locatorABParam,
  sameAs: locatorAParam,
};
export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, screen, properties }) {
        set(screen.validations, element.config.name, {});
        const validationRule = get(screen.validations, element.config.name);
        if (element.config.validation instanceof Array) {
          element.config.validation.forEach((validation) => {
            const rule = this.camelCase(validation.value.split(':')[0]);
            let validationFn = validators[rule];
            if (validation.configs instanceof Array) {
              const params = [];
              validation.configs.forEach(cnf => {
                params.push(cnf.value);
              });
              validationFn = validationsWithLocator[validationFn] && validationFn(validationsWithLocator[validationFn](...params)) || validationFn(...params);
            }
            validationRule[rule] = validationFn;
          });
        }
        properties[':class'] = `{ 'form-group--error': $v.${element.config.name}.$invalid }`;
        // Remove the validation from inside the control
        delete properties[':validation'];
        delete properties['validation'];
        properties[':class'] = `{ 'form-group--error': $v.${element.config.name}.$invalid }`;
        // todo: review the translations for validation errors
        properties[':error'] = `$t($v.${element.config.name}.$invalid ? 'invalid' : '')`;
      },
      onbuild(component) {
        component.mixins.push(validationMixin);
      },
    });
  },
};
