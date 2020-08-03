
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
            this.setupDefaultValue(screen, name, JSON.stringify(config.defaultValue.value));
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
      this.addMounted(screen, `if (!this.${name}) {
        this.${name} = ${value};
      }`);
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen }) {
        this.defaultValues(screen);
      },
    });
  },
};
