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
    items.forEach(item => {
      //If the element has containers
      if (Array.isArray(item)) {
        validate.getDataAndRules(item);
      }

      //If the element has items
      if (item.items) {
        validate.getDataAndRules(item.items);
      }

      //If the element has configuration only
      if (item.config && item.config.name && item.config.validation) {
        validate.elements[`${item.config.name}`] = validate.data[item.config.name];
        validate.rules[`${item.config.name}`] = item.config.validation;
      }
    });
  };

  /**
   * Create the validator that will be used.
   */
  validate.getValidator = () => {
    validate.getDataAndRules(validate.config);
    validate.validator = new Validator(validate.elements, validate.rules);
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
