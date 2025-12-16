export default {
  methods: {
    /**
     * Prepare `data` configuration for the Vue Screen Component
     *
     */
    defaultValues(screen, definition) {
      this.variables.forEach((v) => {
        const { name, config } = v;
        const { component } = v.element;
        if (this.isComputedVariable(name, definition)) return;
        const isCheckbox = component === "FormCheckbox";
        const isDisabled =
          v.element.config.disabled || v.element.config.readonly;
        if (config.defaultValue) {
          if (config.defaultValue.mode === "basic") {
            this.setupDefaultValue(
              screen,
              name,
              `this.mustache(${JSON.stringify(config.defaultValue.value)})`,
              isCheckbox,
              isDisabled
            );
          } else if (config.defaultValue.mode === "js") {
            this.setupDefaultValue(
              screen,
              name,
              `(function() {${config.defaultValue.value}}).bind(this.getDataReference())()`,
              isCheckbox,
              isDisabled
            );
          }
        }
        if ("initiallyChecked" in config) {
          this.setupDefaultValue(
            screen,
            name,
            config.initiallyChecked ? "true" : "false",
            isCheckbox,
            isDisabled
          );
        }
        // Update vdata
        this.addMounted(
          screen,
          `
          this.setValue(${JSON.stringify(name)}, this.getValue(${JSON.stringify(
            name
          )}), this.vdata, this);
        `
        );
      });
    },
    setupDefaultValue(
      screen,
      name,
      value,
      isCheckbox = false,
      isDisabled = false
    ) {
      const safeDotName = this.safeDotName(name);
      const defaultComputedName = `default_${safeDotName}__`;
      // For checkboxes, use explicit undefined checks to preserve false values
      // For other components, use falsy checks to maintain existing behavior
      const wasFilledCheck = isCheckbox
        ? `this.getValue(${JSON.stringify(
            name
          )}, this.vdata) !== undefined || this.getValue(${JSON.stringify(
            name
          )}, data) !== undefined`
        : `!!this.getValue(${JSON.stringify(
            name
          )}, this.vdata) || !!this.getValue(${JSON.stringify(name)}, data)`;
      const mountCheck = isCheckbox
        ? `typeof this.${safeDotName} !== 'boolean'`
        : `!this.${safeDotName}`;

      // For disabled fields, set the default value directly without reactive watchers
      if (isDisabled) {
        this.addMounted(
          screen,
          `if (${mountCheck}) {
            this.tryFormField(${JSON.stringify(name)}, () => {
              this.${safeDotName} = ${value};
              this.setValue(${JSON.stringify(
                name
              )}, ${value}, this.vdata, this);
            });
          }`
        );
        return;
      }
      this.addData(screen, `${name}_was_filled__`, wasFilledCheck);
      this.addMounted(
        screen,
        `if (${mountCheck}) {
            this.tryFormField(${JSON.stringify(name)}, () => {
            this.${safeDotName} = ${value};
            this.setValue(${JSON.stringify(
              name
            )}, ${value}, this.vdata, this);});
        }`
      );
      screen.computed[defaultComputedName] = {
        get: new Function(
          `return this.tryFormField(${JSON.stringify(name)}, () => ${value});`
        ),
        set() {}
      };
      this.addWatch(
        screen,
        defaultComputedName,
        `!this.${safeDotName}_was_filled__ && this.setValue(${JSON.stringify(
          name
        )}, this.${defaultComputedName}, this.vdata, this);`
      );
    }
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.defaultValues(screen, definition);
      },
      onloadproperties({ properties, element, definition }) {
        const { name } = element.config;
        if (this.isComputedVariable(name, definition)) return;
        // Skip input event handler for disabled/readonly fields
        const isDisabled = element.config.disabled || element.config.readonly;
        if (
          (element.config.defaultValue || element.config.initiallyChecked) &&
          !isDisabled
        ) {
          const safeDotName = this.safeDotName(name);
          const event = `${safeDotName}_was_filled__ |= !!$event; !${safeDotName}_was_filled__ && (vdata.${this.dot2bracket(
            name
          )} = default_${safeDotName}__)`;
          this.addEvent(properties, "input", event);
        }
      }
    });
  }
};
