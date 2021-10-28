export default {
  data() {
    return {
      errorsToFocus: [],
    };
  },
  methods: {
    focusError(element, accordion = null) {
      this.errorsToFocus.push({element, accordion});
    },
    focusFirstWatcherError() {
      this.populateWatcherErrors();
      this.focusFirstError();
    },
    focusFirstCalculatedPropertiesError() {
      this.populateCalculatedPropertiesErrors();
      this.focusFirstError();
    },
    focusFirstError() {
      if (this.errorsToFocus.length > 0) {
        const focusConfig = this.errorsToFocus[0];
        const accordionName = focusConfig.accordion;
        const elementName = focusConfig.element;
        const accordionRef = accordionName ? this.$refs[accordionName] : null;
        const elementRef = this.$refs[elementName];

        if (accordionRef && accordionRef.classList.contains('collapsed')) {
          accordionRef.click();
        }

        if (elementName === 'input_data') {
          this.inputDataEditor.focus();
          return;
        }

        if (elementName === 'script_configuration') {
          this.scriptConfigEditor.focus();
          return;
        }

        if (elementName === 'calculated_properties_monaco_formula') {
          this.monacoEditor.focus();
          return;
        }

        const innerFocusable = elementRef.$el.querySelector('[role="combobox"]');
        const innerInput = elementRef.$el.querySelector('input, textarea');

        if (innerFocusable) {
          innerFocusable.focus();
        } else if (innerInput) {
          innerInput.focus();
        } else {
          elementRef.$el.focus();
        }

      }
    },
    populateWatcherErrors() {
      this.errorsToFocus = [];

      if (this.endpointError) {
        this.focusError('endpoint', 'watcherSourceButton');
      }

      for (let item in this.$refs) {
        if (this.$refs[item] && this.$refs[item].name && this.$refs[item].validator && this.$refs[item].validator.errorCount !== 0) {
          if (item === 'name') {
            this.focusError(item, 'watcherConfigButton');
          }
          if (item === 'script') {
            this.focusError(item, 'watcherSourceButton');
          }
        }
      }

      if (!this.config.watching) {
        this.focusError('watching', 'watcherConfigButton');
      }

      if (!this.jsonIsValid('input_data')) {
        this.focusError('input_data', 'watcherSourceButton');
      }
      
      if (!this.jsonIsValid('script_configuration')) {
        this.focusError('script_configuration', 'watcherSourceButton');
      }
    },
    populateCalculatedPropertiesErrors() {
      this.errorsToFocus = [];
      Object.keys(this.errors).forEach(item => {
        if (item === 'formula' && this.isJS) {
          item = 'calculated_properties_monaco_formula';
        }
        this.focusError(item);
      });
    },
  },
};