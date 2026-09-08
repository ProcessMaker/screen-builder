import { validators } from './mixins/ValidationRules';
import DataProvider from './DataProvider';
import { get, set, merge, unset } from 'lodash';
import { Parser } from 'expr-eval';

let globalObject = typeof window === 'undefined'
  ? global
  : window;

let pagesValidated = [];

/**
 * Collect page indexes referenced by FormRecordList "Record Form" configs.
 */
export function collectRecordListFormPages(items, pages = new Set()) {
  if (!Array.isArray(items)) {
    return pages;
  }
  items.forEach((item) => {
    if (!item) {
      return;
    }
    if (item.component === 'FormRecordList' && item.config && item.config.form !== '' && item.config.form != null) {
      pages.add(String(item.config.form));
    }
    if (item.items) {
      collectRecordListFormPages(item.items, pages);
    }
  });
  return pages;
}

/**
 * Collect variable names from a tree of screen items.
 */
export function collectFieldNames(items, names = new Set()) {
  if (!Array.isArray(items)) {
    return names;
  }
  items.forEach((item) => {
    if (!item) {
      return;
    }
    if (item.config && typeof item.config.name === 'string' && item.config.name) {
      names.add(item.config.name);
    }
    if (item.items) {
      collectFieldNames(item.items, names);
    }
  });
  return names;
}

/**
 * Remove validation rules that belong only to Record List form pages so they
 * never block parent-screen submit. Modal renderers (popupConfig with only the
 * form page) keep their rules.
 */
export function stripRecordListFormPageValidations(definition, firstPage, validations) {
  const config = definition && definition.config;
  if (!Array.isArray(config) || !validations || typeof validations !== 'object') {
    return validations;
  }

  const formPages = new Set();
  config.forEach((page) => {
    if (page && page.items) {
      collectRecordListFormPages(page.items, formPages);
    }
  });
  if (formPages.size === 0) {
    return validations;
  }

  // Modal/popup case: config only has the record-form page → keep its rules.
  const presentPages = config
    .map((page, index) => (page ? String(index) : null))
    .filter(Boolean);
  if (
    presentPages.length === 1 &&
    formPages.has(presentPages[0]) &&
    String(firstPage) === presentPages[0]
  ) {
    return validations;
  }

  const firstPageFields = collectFieldNames((config[firstPage] && config[firstPage].items) || []);

  formPages.forEach((pageIndex) => {
    if (String(pageIndex) === String(firstPage)) {
      return;
    }
    const page = config[pageIndex];
    if (!page || !page.items) {
      return;
    }
    collectFieldNames(page.items).forEach((name) => {
      if (!firstPageFields.has(name)) {
        unset(validations, name);
      }
    });
  });

  return validations;
}

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
    // Record List form pages validate only inside the add/edit modal.
    const recordListFormPages = new Set();
    if (Array.isArray(this.screen.config)) {
      this.screen.config.forEach((page) => {
        if (page && page.items) {
          collectRecordListFormPages(page.items, recordListFormPages);
        }
      });
    }
    if (
      recordListFormPages.has(String(screenNumber)) ||
      recordListFormPages.has(String(parseInt(screenNumber, 10)))
    ) {
      return;
    }
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
 * Validate Record List rows using the configured Record Form page.
 *
 * Rules are always namespaced as `${listName}__${fieldName}` so they never
 * collide with root controls and are not double-counted against json-schema
 * entries that use the bare field name. Validators read `listName[]` rows.
 */
class FormRecordListValidations extends Validations {
  async addValidations(validations) {
    if (!this.isVisible()) {
      return;
    }
    // Collection / read-only lists do not use the add/edit record form.
    if (this.element.config && this.element.config.editable === false) {
      return;
    }
    const formIndex = this.element.config && this.element.config.form;
    if (formIndex === '' || formIndex == null) {
      return;
    }
    const listName = this.element.config && this.element.config.name;
    if (!(listName && typeof listName === 'string')) {
      return;
    }
    const formPage = this.screen && this.screen.config && this.screen.config[formIndex];
    if (!formPage || !Array.isArray(formPage.items)) {
      return;
    }

    const rowRules = {};
    const rows = get(this.data, listName);
    const firstRow = (Array.isArray(rows) && rows.length > 0) ? rows[0] : {};
    await ValidationsFactory(formPage.items, {
      screen: this.screen,
      data: { _parent: this.data, ...firstRow },
      parentVisibilityRule: this.element.config.conditionalHide,
      insideLoop: true
    }).addValidations(rowRules);

    Object.keys(rowRules).forEach((fieldName) => {
      if (fieldName === '$each') {
        return;
      }
      const rules = rowRules[fieldName];
      if (!rules || typeof rules !== 'object') {
        return;
      }
      // Always namespace: bare field names are also validated by json-schema /
      // vocabularies; sharing the same key doubles the submit error count.
      const targetName = `${listName}__${fieldName}`.replace(/\./g, '_');
      set(validations, targetName, get(validations, targetName, {}));
      const target = get(validations, targetName);
      Object.keys(rules).forEach((ruleName) => {
        const originalFn = rules[ruleName];
        if (typeof originalFn !== 'function') {
          return;
        }
        target[ruleName] = function(...props) {
          const data = props[1];
          const listRows = get(data, listName);
          // No rows yet: treat as empty field values (required/accepted fail).
          if (!Array.isArray(listRows) || listRows.length === 0) {
            return originalFn.apply(this, [undefined, data]);
          }
          // Every stored row must satisfy the Record Form rule.
          return listRows.every((row) =>
            originalFn.apply(this, [get(row, fieldName), { _parent: data, ...row }])
          );
        };
      });
    });
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
    // Validate Record Form fields against list rows on parent submit.
    // Modal add/edit keeps its own isolated renderer validation.
    return new FormRecordListValidations(element, options);
  }
  if (element.component === 'FormButton' && element.config.event === 'pageNavigate') {
    return new PageNavigateValidations(element, options);
  }
  return new FormElementValidations(element, options);
}

export default ValidationsFactory;
