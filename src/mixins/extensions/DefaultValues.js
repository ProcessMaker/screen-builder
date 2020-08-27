
export default {
  methods: {
    /**
     * Prepare `data` configuration for the Vue Screen Component
     *
     */
    defaultValues(screen) {
      this.variables.forEach(({name, config}) => {
        if (config.defaultValue) {
          if (config.defaultValue.mode === 'basic') {
            this.setupDefaultValue(screen, name, `this.mustache(${JSON.stringify(config.defaultValue.value)})`);
          } else if (config.defaultValue.mode === 'js') {
            this.setupDefaultValue(screen, name, `(function() {${config.defaultValue.value}}).bind(this.vdata)()`);
          }
        }
        if (config.initiallyChecked) {
          this.setupDefaultValue(screen, name, 'true');
        }
        // Update vdata
        this.addMounted(screen, `
          this.setValue(${JSON.stringify(name)}, this.${name}, this.vdata, this);
        `);
      });
    },
    setupDefaultValue(screen, name, value) {
      const defaultComputedName = `default_${name}__`;
      this.addData(screen, `${name}_was_filled__`, `this.getValue(${JSON.stringify(name)}, this.vdata)`);
      this.addMounted(screen, `if (!this.${name}) {
        this.${name} = ${value};
      }`);
      screen.computed[defaultComputedName] = {
        get: new Function(`return ${value};`),
        set() {},
      };
      this.addWatch(screen, defaultComputedName, `!this.${name}_was_filled__ && this.setValue(${JSON.stringify(name)}, this.${defaultComputedName}, this.vdata, this);`);
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen }) {
        this.defaultValues(screen);
      },
      onloadproperties({ properties, element }) {
        const name = element.config.name;
        const event = `${name}_was_filled__ = !!$event.target.value; !${name}_was_filled__ && (vdata.${name} = default_${name}__)`;
        properties['@change'] = event;
      },
    });
  },
};
