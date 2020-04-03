import Mustache from 'mustache';

export default {
  data() {
    return {
      defaultValueApplied: false,
      defaultsInitialized: false,
    }
  },
  methods: {
    initializeDefaultValues() {
      this.defaultsInitialized = false;
      this.activeDefaultValues = {};
      setTimeout(() => {
        if (typeof this.config !== undefined) {
          this.itemsWithDefaultValues(this.config)
            .forEach(item => {
              if (item.config.defaultValue) {
                const path = this.getValidPath(item.config.name);
                this.applyDefaultValues(path, item);
              }
          });
        }
        this.defaultsInitialized = true;
      }, 100);
    },
    itemsWithDefaultValues(items) {
      if (!Array.isArray(items)) {
        return [];
      }

      const results = [];
      items.forEach(item => {
        // Loop will run this inside each iteration, so skip if it's a loop
        if (item.component === 'FormLoop') {
          return;
        }

        if (Array.isArray(item)) {
          this.itemsWithDefaultValues(item)
            .forEach(result => results.push(result));

        } else if ('items' in item) {
          this.itemsWithDefaultValues(item.items)
            .forEach(result => results.push(result));

        } else {
          if (item.config && item.config.defaultValue) {
            if (typeof item.config.defaultValue === 'object') {
              if (item.config.defaultValue.value) {
                results.push(item);
              }
            } else {
              results.push(item);
            }
          }
        }
      });
      return results;
    },
    applyDefaultValues(path, item) {
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

      this.defaultValueApplied = true;
      this.$nextTick(() => this.defaultValueApplied = false);

      const setValue = _.clone(this.model[path]);
      this.activeDefaultValues[path] = { item, setValue };
    },
    updateDefaultValues() {
      if (!this.defaultsInitialized) {
        return;
      }

      // Prevent endless parsing of dynamic defaults, like `new Date()`
      if (this.defaultValueApplied) {
        return;
      }

      for (const path in this.activeDefaultValues) {
        const current = this.model[path];
        const cached = this.activeDefaultValues[path].setValue;

        // Check if any fields were modified from their original default values
        // If so, we no longer want to apply any defaults.
        if (_.isEqual(current, cached)) {
          // No changes, so we can apply the default values
          this.applyDefaultValues(path, this.activeDefaultValues[path].item);
        } else {
          // There are changes, so lets remove it from our list of active elements
          // console.log(this.isLoop, "D2", path);
          this.$delete(this.activeDefaultValues, path);
        }

      };
    },
    setBasicDefaultValue(path, value) {
      const result = Mustache.render(value, this.transientData);
      if (!_.isEqual(this.model[path], result)) {
        this.model[path] = result;
      }
    },
    setJsDefaultValue(path, value) {
      const func = new Function(value);
      const result = func.bind(_.clone(this.transientData))();
      if (!_.isEqual(this.model[path], result)) {
        this.model[path] = result;
      }
    },

  }
}