import { validators } from './mixins/ValidationRules';

let globalObject = typeof window === 'undefined'
  ? global
  : window;
class Validations {
  screen = null;
  firstPage = 0;
  constructor(element, options) {
    this.element = element;
    Object.assign(this, options);
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
      await ValidationsFactory(item, { screen: this.screen }).addValidations(validations);
    }
  }
}

/**
 * Add validations for a screen definition
 */
class ScreenValidations extends Validations {
  async addValidations(validations) {
    // add validations for page 1
    if (this.element.config[this.firstPage]) {
      this.element.pagesValidated = [this.firstPage];
      const screenValidations = ValidationsFactory(this.element.config[this.firstPage].items, { screen: this.element });
      await screenValidations.addValidations(validations);
      delete this.element.pagesValidated;
    }
  }
}

/**
 * Add validations for a nested screen
 */
class FormNestedScreenValidations extends Validations {
  async addValidations(validations) {
    let id = this.element.config.screen;
    // eslint-disable-next-line no-console
    console.log(id);
    const definition = await this.loadScreen(id);
    await ValidationsFactory(definition, { screen: definition }).addValidations(validations);
  }

  async loadScreen(id) {
    if (!globalObject['nestedScreens']) {
      globalObject['nestedScreens'] = {};
    }
    if (globalObject.nestedScreens['id_' + id]) {
      return globalObject.nestedScreens['id_' + id];
    }
    this.$dataProvider.getScreen(id)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log('........load nested.. ' + id);

        globalObject.nestedScreens['id_' + id] = response.data.config;
        return response.data.config;
      });
  }

}

/**
 * Add validations for a loop
 */
class FormLoopValidations extends Validations {
  async addValidations(validations) {
    validations[this.element.config.name] = {};
    validations[this.element.config.name]['$each'] = {};
    await ValidationsFactory(this.element.items, { screen: this.screen }).addValidations(validations);
  }
}

/**
 * Add validations of a page accessed by a navigation button
 */
class PageNavigateValidations extends Validations {
  async addValidations(validations) {
    if (!this.screen.pagesValidated.includes(parseInt(this.element.config.eventData))) {
      this.screen.pagesValidated.push(parseInt(this.element.config.eventData));
      await ValidationsFactory(this.screen.config[this.element.config.eventData].items, { screen: this.screen }).addValidations(validations);
    }
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
    if (this.element.items) {
      ValidationsFactory(this.element.items, { screen: this.screen }).addValidations(validations);
    }
  }
  camelCase(name) {
    return name.replace(/_\w/g, m => m.substr(1, 1).toUpperCase());
  }
}

function ValidationsFactory(element, options) {
  if (element instanceof Array) {
    return new ArrayOfFieldsValidations(element, options);
  }
  if (element.config instanceof Array) {
    return new ScreenValidations(element, options);
  }
  if (element.component === 'FormNestedScreen' && element.config.screen) {
    return new FormNestedScreenValidations(element, options);
  }
  if (element.component === 'FormLoop') {
    return new FormLoopValidations(element, options);
  }
  if (element.component === 'FormRecordList') {
    //return new FormRecordListValidations(element, screen);
  }
  if (element.component === 'FormButton' && element.config.event === 'pageNavigate') {
    return new PageNavigateValidations(element, options);
  }
  return new FormElementValidations(element, options);
}

export default ValidationsFactory;
