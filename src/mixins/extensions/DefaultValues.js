
export default {
  methods: {
    /**
     * Prepare `data` configuration for the Vue Screen Component
     *
     */
    defaultValues(screen, definition) {
      this.variables.forEach(({name, config}) => {
        if (this.isComputedVariable(name, definition)) return;
        if (config.defaultValue) {
          if (config.defaultValue.mode === 'basic') {
            this.setupDefaultValue(screen, name, `this.mustache(${JSON.stringify(config.defaultValue.value)})`);
          } else if (config.defaultValue.mode === 'js') {
            this.setupDefaultValue(screen, name, `(function() {${config.defaultValue.value}}).bind(this.vdata)()`);
          }
        }
        if ('initiallyChecked' in config) {
          this.setupDefaultValue(screen, name, config.initiallyChecked ? 'true' : 'false');
        }
        // Update vdata
        this.addMounted(screen, `
          this.setValue(${JSON.stringify(name)}, this.getValue(${JSON.stringify(name)}), this.vdata, this);
        `);
      });
    },
    setupDefaultValue(screen, name, value) {
      const splittedName = name.split('.').join('_DOT_'); 
      const defaultComputedName = `default_${splittedName}__`;
      this.addData(screen, `${name}_was_filled__`, `!!this.getValue(${JSON.stringify(name)}, this.vdata) || !!this.getValue(${JSON.stringify(name)}, data)`);
      this.addMounted(screen, `if (!this.${name}) {
        this.tryFormField(${JSON.stringify(name)}, () => {this.${this.dot2bracket(name)} = ${value};});
      }`);
      screen.computed[defaultComputedName] = {
        get: new Function(`return this.tryFormField(${JSON.stringify(name)}, () => ${value});`),
        set() {},
      };
      this.addWatch(screen, defaultComputedName, `!this.${name}_was_filled__ && this.setValue(${JSON.stringify(name)}, this.${defaultComputedName}, this.vdata, this);`);
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.defaultValues(screen, definition);
      },
      onloadproperties({ properties, element, definition }) {
        const name = element.config.name;
        if (this.isComputedVariable(name, definition)) return;
        if (element.config.defaultValue || element.config.initiallyChecked) {
          const splittedName = name.split('.').join('_DOT_'); 
          const event = `${name}_was_filled__ |= !!$event; !${name}_was_filled__ && (vdata.${this.dot2bracket(name)} = default_${splittedName}__)`;
          this.addEvent(properties, 'input', event);
        }
      },
    });
  },
};
