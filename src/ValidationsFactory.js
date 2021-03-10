import { validators } from './mixins/ValidationRules';

class Validations {
  constructor(element) {
    this.element = element;
  }
  /**
   * Add a Vuelidate rule for the element.
   * Ex.
   * {
   *   form_input_1: {
   *     required,
   *     minLength: minLength(6)
   *   }
   * }
   */
  async addValidations(validations) {
    throw 'Abstract method addValidations not implemented', validations;
  }
}

/**
 * Add validations for a group of fields
 */
class ArrayOfFieldsValidations extends Validations {
  async addValidations(validations) {
    for (let i = 0, l = this.element.length; i < l; i++) {
      const item = this.element[i];
      await ValidationsFactory(item).addValidations(validations);
    }
  }
}

/**
 * Add validations for a screen definition
 */
class ScreenValidations extends Validations {
  async addValidations(validations) {
    // add validations for page 1
    if (this.element.config[0]) {
      const screenValidations = ValidationsFactory(this.element.config[0].items);
      //screenValidations.setScreen(this.element);
      await screenValidations.addValidations(validations);
    }
  }
}

/**
 * Add validations for a nested screen
 */
class FormNestedScreenValidations extends Validations {
  async addValidations(validations) {
    const definition = await loadScreen();
    await ValidationsFactory(definition).addValidations(validations);
  }

}

/**
 * Add validations for a loop
 */
class FormLoopValidations extends Validations {

}

/**
 * Add validations for a record list
 */
class FormRecordListValidations extends Validations {

}

/**
 * Add validations of a page accessed by a navigation button
 */
class PageNavigateValidations extends Validations {
  async addValidations(validations) {
    await ValidationsFactory(this.definition.config[this.element.config.page].items).addValidations(validations);
  }
}

/**
 * Add validations for a form element
 */
class FormElementValidations extends Validations {
  async addValidations(validations) {
    const validationConfig = this.element.config.validation;
    const fieldName = this.element.config.name;
    validations[fieldName] = validations[fieldName] || {};
    if (validationConfig instanceof Array) {
      validationConfig.forEach((validation) => {
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
          validation.configs.forEach((cnf) => {
            params.push(cnf.value);
          });
          validationFn = validationFn(...params);
        }
        validations[fieldName][rule] = validationFn;
      });
    } else if (typeof validationConfig === 'string' && validationConfig) {
      let validationFn = validators[validationConfig];
      if (!validationFn) {
        // eslint-disable-next-line no-console
        console.error(`Undefined validation rule "${validationConfig}"`);
        return;
      }
      validations[fieldName][validationConfig] = validationFn;
    }
  }
  camelCase(name) {
    return name.replace(/_\w/g, m => m.substr(1,1).toUpperCase());
  }
}

function ValidationsFactory(element) {
  if (element instanceof Array) {
    return new ArrayOfFieldsValidations(element);
  }
  if (element.config instanceof Array) {
    return new ScreenValidations(element);
  }
  if (element.component === 'FormNestedScreen' && element.config.screen) {
    return new FormNestedScreenValidations(element);
  }
  if (element.component === 'FormLoop') {
    return new FormLoopValidations(element);
  }
  if (element.component === 'FormRecordList') {
    return new FormRecordListValidations(element);
  }
  if (element.component === 'FormButton' && element.config.event === 'pageNavigate') {
    return new PageNavigateValidations(element);
  }
  return new FormElementValidations(element);
}

export default ValidationsFactory;
