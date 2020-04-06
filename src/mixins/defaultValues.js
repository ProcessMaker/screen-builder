import Mustache from 'mustache';

export default {
  props: {
    showDebug: {
      type: Boolean,
      default: false, 
    }
  },
  data() {
    return {
      defaultsInitialized: false,
      defaultsFormData: {},
      activeDefaultValues: [],
      lastSetTransientData: null,
    }
  },
  watch: {
    transientData(val) {
      this.debug("---> transientData", JSON.stringify(val));
      if (this.defaultsInitialized) {
        this.update(val);
      }
    },
    config: {
      handler() {
        this.debug("---> config");
        this.initializeDefaultValues();
        this.update(this.transientData);
      },
      deep: true,
      immediate: true,
    },
    mode() {
      this.initializeDefaultValues();
      this.update(this.transientData);
    },
  },
  methods: {
    debug() {
      if (this.showDebug) {
        console.log(this.isLoop, ...arguments);
      }
    },
    update(data) {
      this.debug("update()", JSON.stringify(data));

      if (this.isEqual(data, this.lastSetTransientData)) {
        return;
      }

      this.defaultsFormData = _.cloneDeep(data);
      this.updateDefaultValues();
      // Run this again so previous set defaults get later updates
      this.updateDefaultValues();
      if (this.isEqual(this.transientData, this.defaultsFormData)) {
        return
      }
      this.lastSetTransientData = _.cloneDeep(this.defaultsFormData);
      this.transientData = _.cloneDeep(this.defaultsFormData);
    },
    initializeDefaultValues() {
      this.count = 0;
      this.lastSetTransientData = {};
      this.activeDefaultValues = [];
      this.itemsWithDefaultValues(this.config);
      this.defaultsInitialized = true;
    },
    itemsWithDefaultValues(items) {
      if (!Array.isArray(items)) {
        return;
      }

      items.forEach(item => {
        if (item.component === 'FormLoop' || item.component === 'FormNestedScreen') {
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
        item: item,
        setValue: null,
        inactive: false,
      });
    },

    updateDefaultValues() {
      if (!this.defaultsInitialized) {
        return;
      }

      this.activeDefaultValues.forEach(({path, item, setValue, inactive}, index) => {
        if (inactive) {
          return;
        }

        const current = _.get(this.defaultsFormData, path, null);
        
        // Check if any fields were modified from their original default values
        // If so, we no longer want to apply any defaults.
        if (current === null || setValue === null || this.isEqual(current, setValue)) {
          // No changes, so we can apply the default values
          this.applyDefaultValue(path, item);
          this.activeDefaultValues[index].setValue = this.defaultsFormData[path];

        } else {
          // There are changes, so lets remove it from our list of active elements
          this.activeDefaultValues[index].inactive = true;
        }
      });
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
      try {
        result = Mustache.render(value, this.defaultsFormData);
      } catch(e) { }
      this.defaultsFormData[path] = result;
    },
    setJsDefaultValue(path, value) {
      const func = new Function(value);
      const result = func.bind(_.clone(this.defaultsFormData))();
      this.defaultsFormData[path] = result;
    },

  }
}