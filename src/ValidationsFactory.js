import { validators } from './mixins/ValidationRules';
import DataProvider from './DataProvider';
import { get, set, merge } from 'lodash';
import { Parser } from 'expr-eval';

let globalObject = typeof window === 'undefined'
  ? global
  : window;

let pagesValidated = [];
class Validations {
  screen = null;
  firstPage = 0;
  data = {};
  insideLoop = false;
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
    const visibleInDevice =
      this.element.visibleInDevice === null || this.element.visibleInDevice === undefined
        ? true
        : this.element.visibleInDevice;
    if (!visibleInDevice) {
      return false;
    }

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
      await ValidationsFactory(item, { screen: this.screen, data: this.data, parentVisibilityRule: this.parentVisibilityRule, insideLoop: this.insideLoop }).addValidations(validations);
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
      pagesValidated = [this.firstPage];
      const screenValidations = ValidationsFactory(this.element.config[this.firstPage].items, { screen: this.element, data: this.data });
      await screenValidations.addValidations(validations);
      pagesValidated = [];
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
    const nestedScreen = await this.loadNestedScreen(this.element.config.screen);
    if (nestedScreen && nestedScreen.config) {
      const definition = nestedScreen.config;
      let parentVisibilityRule = this.parentVisibilityRule ? this.parentVisibilityRule : this.element.config.conditionalHide;
      if (definition && definition[0] && definition[0].items) {
        await ValidationsFactory(definition[0].items, { screen: nestedScreen, data: this.data, parentVisibilityRule }).addValidations(validations);
      }
    }
  }

  async loadNestedScreen(id) {
    if (!id) {
      return null;
    }
    if (!globalObject['nestedScreens']) {
      globalObject['nestedScreens'] = {};
    }
    if (globalObject.nestedScreens['id_' + id]) {
      return {config: globalObject.nestedScreens['id_' + id]};
    }
    const response = await DataProvider.getScreen(id);
    globalObject.nestedScreens['id_' + id] = response.data.config;
    return {config: response.data};
  }

  async loadScreen(id) {
    if (!id) {
      return null;
    }
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
    this.checkForSiblings(validations);
    const firstRow = (get(this.data, this.element.config.name) || [{}])[0];
    await ValidationsFactory(this.element.items, { screen: this.screen, data: {_parent: this.data, ...firstRow }, parentVisibilityRule: this.element.config.conditionalHide, insideLoop: true }).addValidations(loopField['$each']);
  }
  checkForSiblings(validations) {
    const siblings = [];
    const siblingValidations = [];
    // Find loops that reference the same variable
    this.screen.config.forEach(page => {
      if (!page || !page.items) {
        return;
      }
      page.items.filter(item => {
        if (item.component === 'FormLoop' && item.config.name === this.element.config.name) {
          siblings.push(item);
        }
      });

      // Get siblings validations
      if (siblings) {
        siblings.forEach(sibling => {
          sibling.items.filter(item => {
            if (!item.config.validation) {
              return;
            }

            item.config.validation.forEach(validation => {
              const rule = this.camelCase(validation.value.split(':')[0]);
              const validationFn = validators[rule];
              const obj = {};
              let ruleObj = {};
              ruleObj[rule] = validationFn;
              obj[item.config.name] = ruleObj;
              merge(siblingValidations, obj);
            });
          });
        });
      }
    });

    if (Object.keys(siblingValidations).length != 0) {
      // Update the loop validations with its siblings.
      const loopValidations = get(validations, this.element.config.name);
      if (loopValidations.hasOwnProperty('$each')) {
        merge(loopValidations['$each'], siblingValidations);
      }
      set(validations[this.element.config.name]['$each'], loopValidations);
    }
  }
  camelCase(name) {
    return name.replace(/_\w/g, m => m.substr(1, 1).toUpperCase());
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
    await ValidationsFactory(this.element.items, { screen: this.screen, data: this.data, parentVisibilityRule: this.element.config.conditionalHide }).addValidations(validations);
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
    const screenNumber = this.element.config.eventData;
    let screenName = 'Empty Screen';
    if (this.screen.config[screenNumber] && this.screen.config[screenNumber].name) {
      screenName = this.screen.config[screenNumber].name;
    }
    const screenPageId = `${screenName}-${screenNumber}`;
    if (pagesValidated.length > 0 && !pagesValidated.includes(screenPageId)) {
      if (this.screen.config[screenNumber] && this.screen.config[screenNumber].items) {
        pagesValidated.push(screenPageId);
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
    // Disable validations if field is hidden
    if (!this.isVisible()) {
      return;
    }
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
    const conditionalHide = this.element.config.conditionalHide;
    const parentVisibilityRule = this.parentVisibilityRule;
    const insideLoop = this.insideLoop || false;
    const deviceConfig = this.element.config.deviceVisibility
      ? this.element.config.deviceVisibility
      : { showForDesktop: true, showForMobile: true };

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
        fieldValidation[rule] = function(...props) {
          const data = props[1];
          const level = fieldName.split('.').length - 1;
          const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
          if (parentVisibilityRule) {
            const nextParentLevel = insideLoop ? 1 : 0;
            const parentDataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level + nextParentLevel);
            let isParentVisible = true;
            try {
              isParentVisible = !!Parser.evaluate(parentVisibilityRule, parentDataWithParent);
            } catch (error) {
              isParentVisible = false;
            }

            if (!isParentVisible ) {
              return true;
            }
          }

          // Check Device Visibility
          let visibleInDevice = true;
          try {
            const isMobileScreen = this.$root.$children[0].$refs.renderer.definition.isMobile;
            visibleInDevice =
              (isMobileScreen && deviceConfig.showForMobile) ||
              (!isMobileScreen && deviceConfig.showForDesktop);
          } catch (error) {
            visibleInDevice = true;
          }
          if (!visibleInDevice) {
            return true;
          }

          // Check Field Visibility
          let visible = true;
          if (conditionalHide) {
            try {
              visible = !!Parser.evaluate(conditionalHide, dataWithParent);
            } catch (error) {
              visible = false;
            }
          }
          if (!visible) {
            return true;
          }
          return validationFn.apply(this,props);
        };
      });
    } else if (typeof validationConfig === 'string' && validationConfig) {
      let validationFn = validators[validationConfig];
      if (!validationFn) {
        // eslint-disable-next-line no-console
        return;
      }
      fieldValidation[validationConfig] = function(...props) {
        const data = props[1];
        const level = fieldName.split('.').length - 1;
        const dataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level);
        // Check Parent Visibility
        if (parentVisibilityRule) {
          const nextParentLevel = insideLoop ? 1 : 0;
          const parentDataWithParent = this.getDataAccordingToFieldLevel(this.getRootScreen().addReferenceToParents(data), level + nextParentLevel);
          let isParentVisible = true;
          try {
            isParentVisible = !!Parser.evaluate(parentVisibilityRule, parentDataWithParent);
          } catch (error) {
            isParentVisible = false;
          }

          if (!isParentVisible) {
            return true;
          }
        }
        // Check Field Visibility
        let visible = true;
        if (conditionalHide) {
          try {
            visible = !!Parser.evaluate(conditionalHide, dataWithParent);
          } catch (error) {
            visible = false;
          }
        }
        if (!visible) {
          return true;
        }
        return validationFn.apply(this,props);
      };
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
  console.log("Validations Factory element", element);
  console.log("Validations Factory options", options);
  return new FormElementValidations(element, options);
}

export default ValidationsFactory;
