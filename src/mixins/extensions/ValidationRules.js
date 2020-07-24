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
  url,
  not,
  or,
  and,
};
export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, screen, properties }) {
        set(screen.validations, element.config.name, {});
        const validationRule = get(screen.validations, element.config.name);
        if (element.config.validation instanceof Array) {
          element.config.validation.forEach((validation) => {
            const rule = validation.value.split(':')[0];
            validationRule[rule] = validators[rule];
          });
        }
        //validations[element.config.name]
        properties[':class'] = `{ 'form-group--error': $v.${element.config.name}.$invalid }`;
      },
      onbuild(component) {
        component.mixins.push(validationMixin);
      },
    });
  },
};
