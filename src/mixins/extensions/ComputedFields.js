export default {
  methods: {
    /**
     * Implements computed fields like this:
     *
     * calcProperty() {
     *   let value = this.evaluateExpression('return formula();', 'javascript');
     *   value = this.addNonDefinedComputedAttributes(value);
     *   this.setValueAsync("calcProperty", value, this.vdata);
     * }
     */
    computedFields(screen, definition, logsEnabled = true) {
      // For each computed field defined
      definition.computed.forEach((computed) => {
        const formula = JSON.stringify(computed.formula);
        const type = JSON.stringify(computed.type);
        const name = JSON.stringify(computed.property);
        const safeDotName = this.safeDotName(computed.property);
        const code = `

        let value = this.evaluateExpression(${formula}, ${type});
          // Handle errors if any
          if (value.error) {
            if (${logsEnabled}) {
              this.customErrorLog(${name}, value.error);
            }
          } else {
            // Add non-defined computed attributes
            value = this.addNonDefinedComputedAttributes(value.result);

            // Set the value
            this.setValue(name, value.result, this.vdata);

            // Log the successful calculation if logging is enabled
            if (${logsEnabled}) {
              this.customSuccessLog(${name});
            }

            // Return the result
            return value.result;
          }
        `;
        this.addComputed(screen, safeDotName, code, "");
        // required to enable reactivity of computed field
        this.addWatch(screen, safeDotName, "");
      });
    }
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        if (definition.computed) {
          this.computedFields(screen, definition);
        }
      }
    });
  }
};
