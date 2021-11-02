import { get, isEqual, set } from 'lodash';
import Mustache from 'mustache';
import { ValidationMsg } from './ValidationRules';

const stringFormats = ['string', 'datetime', 'date', 'password'];

export default {
  schema: [
    function() {
      if (window.ProcessMaker && window.ProcessMaker.packages && window.ProcessMaker.packages.indexOf('package-vocabularies')) {
        if (window.ProcessMaker.VocabulariesSchemaUrl) {
          let response = window.ProcessMaker.apiClient.get(window.ProcessMaker.VocabulariesSchemaUrl);
          return response.then(response => {
            return response.data;
          });
        }
        if (window.ProcessMaker.VocabulariesPreview) {
          return window.ProcessMaker.VocabulariesPreview;
        }
      }
      return {};
    },
  ],
  data() {
    return {
      ValidationRules__: {},
      hiddenFields__: [],
    };
  },
  props: {
    vdata: {
      type: Object,
      required: true,
    },
    _parent: null,
    _initialPage: {
      default: 0,
    },
  },
  computed: {
    references__() {
      return this.$parent && this.$parent.references__;
    },
  },
  methods: {
    getDataAccordingToFieldLevel(dataWithParent, level) {
      if (level === 0 || !dataWithParent) {
        return dataWithParent;
      }
      return this.getDataAccordingToFieldLevel(dataWithParent._parent, level - 1);
    },
    addReferenceToParents(data) {
      if (!data) {
        return;
      }
      const parent = this.addReferenceToParents(this.findParent(data));
      return {
        _parent: parent,
        ...data,
      };
    },
    findParent(child, data = this.vdata, parent = this._parent) {
      if (child === data) {
        return parent;
      }
      for (const key in data) {
        if (data[key] instanceof Array) {
          for (const item of data[key]) {
            const result = this.findParent(child, item, data);
            if (result) {
              return result;
            }
          }
        } else if (data[key] instanceof Object) {
          const found = this.findParent(child, data[key], data);
          if (found) {
            return found;
          }
        } else {
          if (child === data[key]) {
            return parent;
          }
        }
      }
    },
    getRootScreen(screen = this) {
      const parentScreen = screen.$parent.$parent;
      return parentScreen && parentScreen.getRootScreen instanceof Function ? parentScreen.getRootScreen(parentScreen) : screen;
    },
    tryFormField(variableName, callback, defaultValue = null) {
      try {
        return callback();
      } catch (e) {
        set(this.$v, `${variableName}.$invalid`, true);
        set(this.$v, `${variableName}.invalid_default_value`, false);
        return defaultValue;
      }
    },
    mustache(text) {
      try {
        const data = Object.assign({_parent: this._parent}, this.vdata);
        return text && Mustache.render(text, data);
      } catch (e) {
        return 'MUSTACHE: ' + e.message;
      }
    },
    submitForm() {
      if (this.$v.$invalid) {
        //if the form is not valid the data is not emitted
        return;
      }
      this.$emit('submit', this.vdata);
    },
    getValidationData() {
      const screen = this;
      return new Proxy(this.vdata || {}, {
        get(target, name) {
          if (name in target) return target[name];
          if (name === '_parent') return screen._parent === undefined ? this._parent : screen._parent;
        },
      });
    },
    initialValue(component, dataFormat) {
      let value = null;
      if (component === 'FormInput') {
        if (stringFormats.includes(dataFormat)) {
          value = '';
        } else if (dataFormat === 'currency') {
          value = 0;
        }
      } else if (component === 'FormTextArea') {
        value = '';
      }
      return value;
    },
    getValue(name, object = this) {
      return object ? get(object, name) : undefined;
    },
    setValue(name, value, object = this, defaults = object) {
      if (object && value !== undefined) {
        const splittedName = name.split('.');
        splittedName.forEach((attr, index) => {

          let isLastElement, setValue;
          const originalValue = get(object, attr);

          if (index === splittedName.length - 1) {
            isLastElement = true;
          } else {
            isLastElement = false;
          }

          if (isLastElement) {
            setValue = value;

          } else {
            setValue = originalValue;

            if (!setValue) {
              // Check defaults
              setValue = get(defaults, attr);
            }
            
            if (!setValue) {
              // Still no value? Set empty object
              setValue = {};
            }
          }

          if (isLastElement && isEqual(setValue, originalValue)) {
            return;
          }

          this.$set(
            object,
            attr,
            setValue
          );
          object = get(object, attr);
          defaults = get(defaults, attr);
        });
      }
    },
    validationMessage(validation) {
      const message = [];
      Object.keys(ValidationMsg).forEach(key => {
        if (validation[key]!==undefined && !validation[key]) {
          message.push(this.$t(ValidationMsg[key]).replace(/\{(.+?)\}/g,(match,p1)=>{return validation.$params[key][p1];}));
        }
        // JSON Schema use to start with 'schema'
        const keyForSchema = 'schema' + key.charAt(0).toUpperCase() + key.slice(1);
        if (validation[keyForSchema]!==undefined && !validation[keyForSchema]) {
          message.push(this.$t(ValidationMsg[key]).replace(/\{(.+?)\}/g,(match,p1)=>{return validation.$params[keyForSchema][p1];}));
        }
      });
      return message.join('.\n');
    },
    getCurrentPage() {
      return this.currentPage__;
    },
    setCurrentPage(page) {
      this.currentPage__ = page;
    },
  },
  validations() {
    return { vdata: this.ValidationRules__ };
  },
};
