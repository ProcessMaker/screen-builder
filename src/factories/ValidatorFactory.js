import _ from 'lodash';
import './CustomValidationRules';

const Validator = require('validatorjs');

export function ValidatorFactory(config, data) {
  const validate = {};
  const rules = {
    int: 'integer',
    boolean: 'boolean',
    string: 'string',
    datetime: 'custom-datetime',
    date: 'custom-date',
    float: 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
    currency: 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
    array: 'array',
    percentage: 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
    password: 'string',
  };

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
      if (!item) return;
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

      if (item.component === 'FormNestedScreen') {
        const nestedScreen = _.get(window, 'nestedScreens.id_' + item.config.screen);
        if (nestedScreen) {
          validate.getDataAndRules(nestedScreen);
        }
      }

      //If the element has configuration only
      if (item.config && item.config.name && item.config.validation) {
        validate.addRule(item.config.name, item.config.validation);
      }

      //If the element has dataformat configurated
      if (item.component ===  'FormInput' && item.config && item.config.name && item.config.dataFormat ){
        validate.addRuleFormat(item.config.name, item.config.dataFormat);
      }
    });
  };

  validate.addRule = (name, validation) => {
    let validationRule = [];
    if (typeof validation === 'string') {
      validationRule.push(validation);
    } else {
      validation.forEach((rule) => {
        validationRule.push(rule.value);
      });
    }
    validate.rules[name] = validationRule;
  };

  validate.addRuleFormat = (name, validation) => {
    if (!validate.rules[name]) {
      validate.rules[name] = [];
    }
    validate.rules[name].push(rules[validation]);
  };

  validate.ruleFormLoop = (loopName, items) => {
    items.forEach((itemLoop) => {
      if (Array.isArray(itemLoop)) {
        validate.ruleFormLoop(loopName, itemLoop);
      }

      if (itemLoop.items) {
        if (itemLoop.component === 'FormLoop') {
          validate.ruleFormLoop(
            loopName + '.*.' + itemLoop.config.name,
            itemLoop.items
          );
        } else {
          validate.ruleFormLoop(loopName, itemLoop.items);
        }
      }

      //If the element has validation configurated
      if (
        itemLoop.config &&
        itemLoop.config.name &&
        itemLoop.config.validation
      ) {
        
        if (Array.isArray(itemLoop.config.validation)) {
          itemLoop.config.validation.forEach(validation => {
            if (!validation.value.includes(':')) {
              return;
            }
            const rule = validation.value.split(':')[0];
            let fieldName = validation.value.split(':')[1];
            let newValidationRule;
            if (rule.includes('required_') || rule.includes('same')) {
              if (fieldName.includes('_parent')) {
                fieldName = fieldName.split('_parent.').pop();
                newValidationRule = rule + ':' + fieldName;
              } else if (!fieldName.includes(',')) {
                newValidationRule = rule + ':' + loopName + '.*.' + fieldName;
              } else {
                fieldName = fieldName.split(',')[0];
                const fieldValue = validation.value.split(':')[1].split(',')[1];
                newValidationRule = rule + ':' + loopName + '.*.' + fieldName + ',' + fieldValue;
              }
              validation.value = newValidationRule;  
            }
          });
        }

        validate.addRule(
          loopName + '.*.' + itemLoop.config.name,
          itemLoop.config.validation
        );
      }

      //If the element has dataformat configurated
      if (
        itemLoop.component ===  'FormInput' &&
        itemLoop.config &&
        itemLoop.config.name &&
        itemLoop.config.dataFormat
      ) {
        validate.addRuleFormat(
          loopName + '.*.' + itemLoop.config.name,
          itemLoop.config.dataFormat
        );
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
