
export default {
  methods: {
    /**
     * Prepare `data` configuration for the Vue Screen Component
     *
     * @param screen 
     */
    defaultValues(screen) {
      this.variables.forEach(({name, config}) => {
        if (config.defaultValue) {
          if (config.defaultValue.mode === 'basic') {
            this.setupDefaultValue(screen, name, JSON.stringify(config.defaultValue.value));
          } else if (config.defaultValue.mode === 'js') {
            this.setupDefaultValue(screen, name, `(()=>{${config.defaultValue.value}})()`);
          } else {
            throw JSON.stringify({name, config});
          }
        } else {
          this.setupDefaultValue(screen, name, 'null');
        }
        if (config.initiallyChecked) {
          this.setupDefaultValue(screen, name, 'true');
        }
      });
    },
    setupDefaultValue(screen, name, value) {
      screen.mounted.push(`if (!this.${name}) {
        this.${name} = ${value};
        this.setValue(${JSON.stringify(name)}, this.${name});
      }`);
    },
  },
  mounted() {
    this.extensions.push({
      onbuild(screen) {
        this.defaultValues(screen);
      },
    });
  },
};
