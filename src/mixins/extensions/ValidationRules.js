import { set, get } from 'lodash';
import { validationMixin } from 'vuelidate';
import { validators } from '../ValidationRules';

export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, screen, properties }) {
        if (this.validVariableName(element.config.name)) {
          set(screen.validations, element.config.name, {});
          const validationRule = get(screen.validations, element.config.name);
          if (element.config.validation instanceof Array) {
            element.config.validation.forEach((validation) => {
              const rule = this.camelCase(validation.value.split(':')[0]);
              let validationFn = validators[rule];
              if (!validationFn) {
                throw `Undefined validation rule "${rule}"`;
              }
              if (validation.configs instanceof Array) {
                const params = [];
                validation.configs.forEach(cnf => {
                  params.push(cnf.value);
                });
                //validationFn = validationsWithLocator[validationFn] && validationFn(validationsWithLocator[validationFn](...params)) || validationFn(...params);
                validationFn = validationFn(...params);
              }
              validationRule[rule] = validationFn;
            });
          }
          properties[':class'] = `{ 'form-group--error': $v.${element.config.name}.$invalid }`;
          // Remove the validation from inside the control
          delete properties[':validation'];
          delete properties['validation'];
          properties[':class'] = `{ 'form-group--error': $v.${element.config.name}.$invalid }`;
          properties[':error'] = `validationMessage($v.${element.config.name})`;
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(validationMixin);
      },
    });
  },
};
