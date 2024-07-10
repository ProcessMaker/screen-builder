import { get, isEqual, set, debounce } from 'lodash';
import Mustache from 'mustache';
import { mapActions, mapGetters, mapState } from 'vuex';
import { ValidationMsg } from './ValidationRules';
import DataReference from "./DataReference";
import computedFields from "./computedFields";
import { findRootScreen } from "./DataReference";

const stringFormats = ['string', 'datetime', 'date', 'password'];
const parentReference = [];

export default {
  name: "ScreenContent",
  mixins: [DataReference, computedFields],
  schema: [
    function() {
      if (window.ProcessMaker && window.ProcessMaker.packages && window.ProcessMaker.packages.includes('package-vocabularies')) {
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
    ...mapState("globalErrorsModule", {
      valid__: "valid",
      message__: "message",
      locked__: "locked",
      disableSubmit__: "disableSubmit",
    }),
    ...mapGetters("globalErrorsModule", ["showValidationErrors"]),
    references__() {
      return this.$parent && this.$parent.references__;
    },
  },
  methods: {
    ...mapActions("globalErrorsModule", ["validateNow", "hasSubmitted", 'disableSubmit']),
    getDataAccordingToFieldLevel(dataWithParent, level) {
      if (level === 0 || !dataWithParent) {
        return dataWithParent;
      }
      return this.getDataAccordingToFieldLevel(dataWithParent._parent, level - 1);
    },
    addReferenceToParents(data) {
      if (!data) {
        return undefined;
      }
      const parent = this.addReferenceToParents(this.findParent(data));
      return new Proxy(
        {},
        {
          get: (target, name) => {
            if (name === "_parent" && parent) {
              return parent;
            }
            if (name in target) {
              return target[name];
            }
            return data[name];
          },
          has: (target, name) => {
            if (name === "_parent") {
              return parent !== undefined;
            }
            return data[name] !== undefined || target[name] !== undefined;
          },
          // ValidationRules mixin uses this to set the value of some custom fields like "today" date
          set: (target, name, value) => {
            target[name] = value;
            return true;
          }
        }
      );
    },
    findParent(child, data = this.vdata, parent = this._parent) {

      if (child === data) {
        return parent;
      }
      for (const key in data) {
        if (key === '_parent') {
          continue;
        }
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
        let result = callback();
        return (result === undefined) ? null : result;
      } catch (e) {
        set(this.$v, `${variableName}.$invalid`, true);
        set(this.$v, `${variableName}.invalid_default_value`, false);
        return defaultValue;
      }
    },
    mustache(text) {
      try {
        const data = this.getDataReference();
        return text && Mustache.render(text, data);
      } catch (e) {
        return 'MUSTACHE: ' + e.message;
      }
    },
    async submitForm(eventData, loading = false, buttonInfo = null) {
      const event = {
        name: 'after-submit',
        validation: true
      };
      this.$emit('after-submit', event, ...arguments);
      if (event.validation === false) {
        this.$emit('submit', this.vdata, loading, buttonInfo);
        return;
      }
      await this.validateNow(findRootScreen(this));
      this.hasSubmitted(true);
      if (!this.valid__ || this.disableSubmit__) {
        if (this.message__) {
          window.ProcessMaker.alert(this.message__, "danger");
        }
        // if the form is not valid the data is not emitted
        return;
      }
      this.$emit('submit', this.vdata, loading, buttonInfo);
    },
    resetValue(safeDotName, variableName) {
      this.setValue(safeDotName, null);
      this.updateScreenDataNow(safeDotName, variableName, false);
    },
    getValidationData() {
      return this.vdata;
    },
    initialValue(component, dataFormat, config) {
      let value = null;
      if (component === 'FormInput') {
        if (stringFormats.includes(dataFormat)) {
          value = '';
        } else if (dataFormat === 'currency') {
          value = 0;
        }
      } else if (component === 'FormTextArea') {
        value = '';
      } else if (component === 'FormSelectList' && config.options.allowMultiSelect) {
        value = [];
      } else if (component === 'FormSelectList' && !config.options.allowMultiSelect) {
        value = null;
      } else if (component === "FormLoop") {
        value = this.emptyLoopValue(config);
      }
      return value;
    },
    emptyLoopValue(config) {
      if (config.settings.type === "existing") {
        return [];
      }
      const times = Number(config.settings.times);
      const loopVariable = [];
      for (let i = 0; i < times; i++) {
        loopVariable.push({});
      }
      return loopVariable;
    },
    updateScreenData(safeDotName, variable) {
      this[`${safeDotName}_was_filled__`] = true;
      this.blockUpdate(safeDotName, 210);
      this.setValueDebounced(variable, this[safeDotName], this.vdata);
    },
    updateScreenDataNow(safeDotName, variable, setWasFilled = true) {
      if (setWasFilled) {
        this[`${safeDotName}_was_filled__`] = true;
      }
      this.setValue(variable, this[safeDotName], this.vdata);
      this.unblockUpdate(safeDotName);
    },
    blockUpdate(safeDotName, time) {
      this.blockedUpdates[safeDotName] = new Date().getTime() + time;
    },
    unblockUpdate(safeDotName) {
      this.blockUpdate(safeDotName, 0);
    },
    canUpdate(safeDotName) {
      return (
        !this.blockedUpdates[safeDotName] ||
        this.blockedUpdates[safeDotName] < new Date().getTime()
      );
    },
    getValue(name, object = this) {
      return object ? get(object, name) : undefined;
    },
    setValue(name, value, object = this, defaults = object) {
      if (object && value !== undefined) {
        const parsedName = name.split('.');

        for (const attr of parsedName) {
          let setValue;
          let index = parsedName.indexOf(attr);
          let isLastElement = index === parsedName.length - 1;

          const originalValue = get(object, attr);

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

          if (object instanceof Object) {
            this.$set(object, attr, setValue);
          }

          object = get(object, attr);
          defaults = get(defaults, attr);
        }
      }
    },
    addNonDefinedComputedAttributes(value, key, owner = null) {
      if (value instanceof Array) {
        value.forEach((item, index) => {
          this.addNonDefinedComputedAttributes(item, index, value);
        });
      } else if (value instanceof Object) {
        Object.keys(value).forEach((k) => {
          this.addNonDefinedComputedAttributes(value[k], k, value);
        });
      } else if (
        owner &&
        owner instanceof Object &&
        !(value instanceof Array)
      ) {
        // check if value is reactive using getOwnPropertyDescriptor
        const descriptor = Object.getOwnPropertyDescriptor(owner, key);
        const isReactive = descriptor && descriptor.get;
        if (!isReactive) {
          // remove static value
          delete owner[key];
          // add reactive value
          this.$set(owner, key, value);
        }
      }
      return value;
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
    setValueAsync(name, value, object = this, defaults = object) {}
  },
  validations() {
    return { vdata: this.ValidationRules__ };
  },
  created() {
    this.blockedUpdates = {};
    const debouncedValuesQueue = [];
    const setDebouncedValues = debounce(() => {
      debouncedValuesQueue.forEach((args) => {
        this.setValue(...args);
      });
      debouncedValuesQueue.length = 0;
    }, 210);
    this.setValueDebounced = (...args) => {
      debouncedValuesQueue.push(args);
      setDebouncedValues();
    };
    this.setValueAsync = (name, value, object = this, defaults = object) =>
      Promise.resolve().then(() => {
        this.setValue(name, value, object, defaults);
      });
  }
};
