
const stringFormats = ['string', 'datetime', 'date', 'password'];

export default {
  methods: {
    /**
     * Prepare `data` configuration for the Vue Screen Component
     *
     */
    defaultValues(screen, definition) {
      this.variables.forEach(({name, config, element}) => {
        if (this.isComputedVariable(name, definition)) return;
        this.setupInitialValues(screen, name, element);
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
    setupInitialValues(screen, name, element) {
      let fnValue = 'null';
      if (element.component === 'FormInput') {
        if (stringFormats.includes(element.config.dataFormat)) {
          fnValue = '""'; // empty string
        } else if (element.config.dataFormat === 'currency') {
          fnValue = '0';
        }
      } else if (element.component === 'FormTextArea') {
        fnValue = '""'; // empty string
      }
      this.addData(screen, name, fnValue);
    },
    setupDefaultValue(screen, name, value) {
      const defaultComputedName = `default_${name}__`;
      this.addData(screen, `${name}_was_filled__`, `!!this.getValue(${JSON.stringify(name)}, this.vdata)`);
      this.addMounted(screen, `if (!this.${name}) {
        this.tryFormField(${JSON.stringify(name)}, () => {this.${name} = ${value};});
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
          const event = `${name}_was_filled__ |= !!$event; !${name}_was_filled__ && (vdata.${name} = default_${name}__)`;
          this.addEvent(properties, 'input', event);
        }
      },
    });
  },
};
