const Validator = require('validatorjs');

export function ValidatorFactory(config, data) {
  const validate = {};
  validate.validator = null;
  validate.config = config;
  validate.data = data;
  validate.elements = {};
  validate.rules = {};

  /**
   * Search elements and validation rules from the screen configuration
   *
   * @param items from screen configuration.
   */
  validate.getDataAndRules = (items) => {
    items.forEach((item) => {
      //If the element has containers
      if (Array.isArray(item)) {
        validate.getDataAndRules(item);
      }

      //If the element has items
      if (item.items) {
        if (item.component === 'FormLoop') {
          validate.ruleFormLoop(item.config.name, item.items);
        } else {
          validate.getDataAndRules(item.items);
        }
      }

      //If the element has configuration only
      if (item.config && item.config.name && item.config.validation) {
        validate.addRule(item.config.name, item.config.validation);
      }
    });
  };

  validate.addRule = (name, validation) => {
    if (typeof validation === 'string') {
      validate.rules[name] = validation;
    } else {
      let validationRule = [];
      validation.forEach((rule) => {
        validationRule.push(rule.value);
      });
      validate.rules[name] = validationRule;
    }
  };

  validate.ruleFormLoop = (loopName, items) => {
    items.forEach((itemLoop) => {
      if (Array.isArray(itemLoop)) {
        validate.ruleFormLoop(loopName, itemLoop);
      }

      if (itemLoop.items) {
        if (itemLoop.component === 'FormLoop') {
          validate.ruleFormLoop(loopName +'.*.'+itemLoop.config.name, itemLoop.items);
        } else {
          validate.ruleFormLoop(loopName, itemLoop.items);
        }
      }
      if (
        itemLoop.config &&
        itemLoop.config.name &&
        itemLoop.config.validation
      ) {
        let name = loopName + '.*.' + itemLoop.config.name;
        validate.addRule(name, itemLoop.config.validation);
      }
    });
  };

  /**
   * Create the validator that will be used.
   */
  validate.getValidator = () => {
    validate.getDataAndRules(validate.config);
    validate.validator = new Validator(validate.data, validate.rules);
  };

  /**
   * Returns error messages if there are failed validations.
   */
  validate.getErrors = () => {
    if (validate.failed()) {
      return validate.validator.errors.errors;
    }
    return {};
  };

  /**
   * Check if the validations failed.
   *
   * @returns {boolean}
   */
  validate.failed = () => {
    validate.getValidator();
    return validate.validator.fails();
  };

  return validate;
}
