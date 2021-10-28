import { validators } from './mixins/ValidationRules';
import DataProvider from './DataProvider';
import { get, set } from 'lodash';
import { Parser } from 'expr-eval';

let globalObject = typeof window === 'undefined'
  ? global
  : window;
class Validations {
  screen = null;
  firstPage = 0;
  data = {};
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

  /**
   * Check if element/container is visible.
   */
  isVisible() {
    // Disable validations if field is hidden
    let visible = true;
    if (this.element.config.conditionalHide) {
      try {
        visible = !!Parser.evaluate(this.element.config.conditionalHide, this.data);
      } catch (error) {
        visible = false;
      }
    }
    return visible;
  }    
}

/**
 * Add validations for a group of fields
 */
class ArrayOfFieldsValidations extends Validations {
  async addValidations(validations) {
    for (const item of this.element) {
      await ValidationsFactory(item, { screen: this.screen, data: this.data }).addValidations(validations);
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
      const screenValidations = ValidationsFactory(this.element.config[this.firstPage].items, { screen: this.element, data: this.data });
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
    // Disable validations if field is hidden
    if (!this.isVisible()) {
      return;
    }
    const definition = await this.loadScreen(this.element.config.screen);
    if (definition && definition[0] && definition[0].items) {
      await ValidationsFactory(definition[0].items, { screen: this.screen, data: this.data }).addValidations(validations);
    }
  }

  async loadScreen(id) {
    if (!globalObject['nestedScreens']) {
      globalObject['nestedScreens'] = {};
    }
    if (globalObject.nestedScreens['id_' + id]) {
      return globalObject.nestedScreens['id_' + id];
    }
    const response = await DataProvider.getScreen(id);
    globalObject.nestedScreens['id_' + id] = response.data.config;
    return response.data.config;
  }

}

/**
 * Add validations for a loop
 */
class FormLoopValidations extends Validations {
  async addValidations(validations) {
    // Disable validations if field is hidden
    if (!this.isVisible()) {
      return;
    }
    set(validations, this.element.config.name, {});
    const loopField = get(validations, this.element.config.name);
    loopField['$each'] = {};
    const firstRow = (get(this.data, this.element.config.name) || [{}])[0];
    await ValidationsFactory(this.element.items, { screen: this.screen, data: {_parent: this.data, ...firstRow } }).addValidations(loopField['$each']);
  }
}

/**
 * Add validations for a multicolumn
 */
class FormMultiColumnValidations extends Validations {
  async addValidations(validations) {
    // Disable validations if field is hidden
    if (!this.isVisible()) {
      return;
    }
    await ValidationsFactory(this.element.items, { screen: this.screen, data: this.data }).addValidations(validations);
  }
}

/**
 * Add validations of a page accessed by a navigation button
 */
class PageNavigateValidations extends Validations {
  async addValidations(validations) {
    // Disable validations if field is hidden
    if (!this.isVisible()) {
      return;
    }
    if (this.screen.pagesValidated && !this.screen.pagesValidated.includes(parseInt(this.element.config.eventData))) {
      this.screen.pagesValidated.push(parseInt(this.element.config.eventData));
      if (this.screen.config[this.element.config.eventData] && this.screen.config[this.element.config.eventData].items) {
        await ValidationsFactory(this.screen.config[this.element.config.eventData].items, { screen: this.screen, data: this.data }).addValidations(validations);
      }
    }
  }
}

/**
 * Add validations for a form element
 */
class FormElementValidations extends Validations {
  async addValidations(validations) {
    if (this.element.config && this.element.config.readonly) {
      //readonly elements do not need validation
      return;
    }
    if (this.element.config && this.element.config.disabled) {
      //disabled elements do not need validation
      return;
    }
    if (!(this.element.config && this.element.config.name && typeof this.element.config.name === 'string' && this.element.config.name.match(/^[a-zA-Z_][0-9a-zA-Z_.]*$/))) {
      //element invalid
      return;
    }
    const fieldName = this.element.config.name;
    const validationConfig = this.element.config.validation;

    // Disable validations if field is hidden
    if (this.element.config.conditionalHide) {
      let visible = true;
      try {
        visible = !!Parser.evaluate(this.element.config.conditionalHide, this.data);
      } catch (error) {
        visible = false;
      }
      if (!visible) {
        return;
      }
    }

    set(validations, fieldName, get(validations, fieldName, {}));
    const fieldValidation = get(validations, fieldName);
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
          params.push(fieldName);
          validationFn = validationFn(...params);
        }
        fieldValidation[rule] = validationFn;
      });
    } else if (typeof validationConfig === 'string' && validationConfig) {
      let validationFn = validators[validationConfig];
      if (!validationFn) {
        // eslint-disable-next-line no-console
        console.error(`Undefined validation rule "${validationConfig}"`);
        return;
      }
      fieldValidation[validationConfig] = validationFn;
    }
    if (this.element.items) {
      ValidationsFactory(this.element.items, { screen: this.screen, data: this.data }).addValidations(validations);
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
  if (element.component === 'FormNestedScreen') {
    return new FormNestedScreenValidations(element, options);
  }
  if (element.component === 'FormMultiColumn') {
    return new FormMultiColumnValidations(element, options);
  }
  if (element.component === 'FormLoop') {
    return new FormLoopValidations(element, options);
  }
  if (element.component === 'FormRecordList') {
    //not required
    //return new FormRecordListValidations(element, screen);
  }
  if (element.component === 'FormButton' && element.config.event === 'pageNavigate') {
    return new PageNavigateValidations(element, options);
  }
  return new FormElementValidations(element, options);
}

export default ValidationsFactory;
