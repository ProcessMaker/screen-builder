/* istanbul ignore file */
import Mustache from 'mustache';
import _ from 'lodash';

export default {
  props: {
    showDebug: {
      type: Boolean,
      default: false, 
    },
    debugContext: {
      type: String,
      default: 'Root', 
    },
  },
  data() {
    return {
      defaultsInitialized: false,
      defaultsFormData: {},
      activeDefaultValues: [],
      lastSetTransientData: null,
      lastConfig: null,
    };
  },
  watch: {
    transientData: {
      handler(val) {
        this.debug('---> transientData', JSON.stringify(val));
        if (!this.defaultsInitialized) {
          this.initializeDefaultValues();
        }
        this.update(val);
      },
      deep: true,
      immediate: true,
    },
    config: {
      handler() {
        if (this.isEqual(this.lastConfig, this.config)) {
          return;
        }
        this.lastConfig = _.clone(this.config);

        this.debug('---> config', _.truncate(JSON.stringify(this.config)));
        this.initializeDefaultValues();
        this.update(this.data);
      },
      deep: true,
      immediate: true,
    },
    mode() {
      this.debug('MODE changed', JSON.stringify(this.data));
      this.initializeDefaultValues();
      this.update(this.data);
    },
  },
  methods: {
    debug() {
      if (this.showDebug) {
        // eslint-disable-next-line no-console
        console.log(this.debugContext, ...arguments);
      }
    },
    update(data) {
      this.debug('update()', JSON.stringify(data));

      if (this.isEqual(data, this.lastSetTransientData)) {
        this.debug('R1');
        return;
      }

      this.defaultsFormData = _.cloneDeep(data);
      this.updateDefaultValues();
      // Run this again so previous set defaults get later updates
      this.updateDefaultValues();

      if (this.isEqual(this.transientData, this.defaultsFormData)) {
        this.debug('R2');
        return;
      }

      if (this.isEqual(this.defaultsFormData, this.lastSetTransientData)) {
        this.debug('R3');
        return;
      }

      this.$delete(this.defaultsFormData, '_parent');
      
      this.lastSetTransientData = _.cloneDeep(this.defaultsFormData);
      this.transientData = _.cloneDeep(this.defaultsFormData);
      this.debug('SET transient data to', JSON.stringify(this.transientData));
    },
    initializeDefaultValues() {
      this.lastSetTransientData = null;
      this.activeDefaultValues = [];
      this.itemsWithDefaultValues(this.config);
      this.defaultsInitialized = true;
      this.debug('initializeDefaultValues done');
    },
    itemsWithDefaultValues(items) {
      if (!Array.isArray(items)) {
        return;
      }

      items.forEach(item => {
        if (!item) {
          // Record list starts with a single, undefined item.
          return;
        }

        if (['FormLoop', 'FormNestedScreen', 'FormRecordList'].includes(item.component)) {
          return;
        }

        if (Array.isArray(item)) {
          this.itemsWithDefaultValues(item);

        } else if ('items' in item) {
          this.itemsWithDefaultValues(item.items);

        } else {
          if (item.config && item.config.defaultValue) {
            if (typeof item.config.defaultValue === 'object') {
              if (item.config.defaultValue.value) {
                this.addToActiveDefaultValues(item);
              }
            } else {
              this.addToActiveDefaultValues(item);
            }
          }
        }
      });
    },
    addToActiveDefaultValues(item) {
      this.activeDefaultValues.push({
        path: this.getValidPath(item.config.name),
        item,
        setValue: null,
        inactive: false,
      });
    },

    updateDefaultValues() {
      if (!this.defaultsInitialized) {
        return;
      }

      const changes = {};
      this.activeDefaultValues.forEach(({path, item, setValue, inactive}, index) => {
        if (inactive) {
          return;
        }

        const current = _.get(this.defaultsFormData, path, null);

        if (current !== null && setValue === null) {
          // This is a value already set in the data object. Make inactive.
          this.activeDefaultValues[index].inactive = true;
          changes[path] = 'Inactive';
          return;
        }
        
        // Check if any fields were modified from their original default values
        // If so, we no longer want to apply any defaults.
        if (current === null || setValue === null || this.isEqual(current, setValue)) {
          // No changes, so we can apply the default values
          this.applyDefaultValue(path, item);
          changes[path] = String(setValue) + ' --> ' + String(this.defaultsFormData[path]);
          this.activeDefaultValues[index].setValue = this.defaultsFormData[path];

        } else {
          // There are changes, so lets remove it from our list of active elements
          this.activeDefaultValues[index].inactive = true;
          changes[path] = 'Inactive';
        }
      });
      this.debug('Changes', changes);
    },

    isEqual(a, b) {
      if (typeof a === 'object') {
        return _.isEqual(a, b);
      }
      return String(a) === String(b);
    },

    applyDefaultValue(path, item) {
      if (typeof item.config.defaultValue === 'string') {
        this.setBasicDefaultValue(path, item.config.defaultValue);
      } else {
        const value = item.config.defaultValue.value;
        if (!value) {
          return;
        }
        if (item.config.defaultValue.mode === 'js') {
          this.setJsDefaultValue(path, value);
        } else {
          this.setBasicDefaultValue(path, value);
        }
      }
    },

    setBasicDefaultValue(path, value) {
      let result = value;
      if (value.includes('{{')) {
        try {
          result = Mustache.render('{' + value + '}', this.defaultsFormData);
        } catch (e) {
          e;
        }
      }
      this.defaultsFormData[path] = result;
    },
    setJsDefaultValue(path, value) {
      const func = new Function(value);
      const result = func.bind(_.clone(this.defaultsFormData))();
      this.defaultsFormData[path] = result;
    },

  },
};