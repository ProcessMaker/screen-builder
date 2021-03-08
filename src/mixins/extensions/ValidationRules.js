import { set, get } from 'lodash';
import { validationMixin } from 'vuelidate';
import { validators } from '../ValidationRules';

export default {
  methods: {
    addRules(config, validationRule) {
      if (config instanceof Array) {
        config.forEach((validation) => {
          const rule = this.camelCase(validation.value.split(':')[0]);
          if (!rule) {
            return;
          }
          let validationFn = validators[rule];
          if (!validationFn) {
            // eslint-disable-next-line no-console
            console.error(`Undefined validation rule "${rule}"`);
            return;
          }
          if (validation.configs instanceof Array) {
            const params = [];
            validation.configs.forEach(cnf => {
              params.push(cnf.value);
            });
            validationFn = validationFn(...params);
          }
          validationRule[rule] = validationFn;
        });
      }
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties({ element, screen, properties }) {
        if (this.validVariableName(element.config.name)) {
          set(screen.validations, element.config.name, {});
          const validationRule = get(screen.validations, element.config.name);
          this.addRules(element.config.validation, validationRule);

          if (element.component === 'FormLoop') {
            //Collections validation
            validationRule['$each'] = [];

            element.items.forEach((item) => {
              set(validationRule['$each'], item.config.name, {});
              const validationLoopRule = get(validationRule['$each'], item.config.name);
              this.addRules(item.config.validation, validationLoopRule);
            });
          }

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
