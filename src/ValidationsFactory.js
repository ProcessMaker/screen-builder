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
    // @todo remove test async validators
    await new Promise(resolve => setTimeout(resolve, 1000));
    // @todo remove sample validation
    Object.assign(validations, { form_input_1: {required: validators['required']} });
  }
}

/**
 * Add validations for a group of fields
 */
class ArrayOfFieldsValidations extends Validations {
  async addValidations(validations) {
    for (let i=0, l= this.element.length; i < l; i++) {
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
      screenValidations.setScreen(this.element);
      await validations.addValidations(validations);
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
