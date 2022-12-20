export default {
  methods: {
    /**
     * calcProperty() {
     *   let value = this.evaluateExpression('return formula();', 'javascript');
     *   value = this.addNonDefinedComputedAttributes(value);
     *   this.setValueAsync("calcProperty", value, this.vdata);
     * }
     */
    computedFields(screen, definition) {
      // For each computed field defined
      definition.computed.forEach((computed) => {
        const formula = JSON.stringify(computed.formula);
        const type = JSON.stringify(computed.type);
        const name = JSON.stringify(computed.property);
        const safeDotName = this.safeDotName(computed.property);
        const code = `
        let value = this.evaluateExpression(${formula}, ${type});
        value = this.addNonDefinedComputedAttributes(value);
        this.setValue(${name}, value, this.vdata);
        return value;`;
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
