export default {
  methods: {
    dataFields(screen, definition) {
      const localVariables = this.variables.filter(
        (v) => !this.isComputedVariable(v.name, definition)
      );
      localVariables.forEach((v) => {
        const { component } = v.element;
        const dataFormat = v.config.dataFormat || null;
        const safeDotName = this.safeDotName(v.name);
        // Use nullish coalescing so valid falsy values (0, '', [], false) are preserved.
        // The previous `||` chain treated those as missing and fell back to initialValue
        // (e.g. FormRecordList collection radio/single-field selections became null).
        this.addData(
          screen,
          safeDotName,
          `
            this.getValue(${JSON.stringify(v.name)}, this.vdata) ??
            this.getValue(${JSON.stringify(v.name)}, data) ??
            this.initialValue(
              '${component}',
              '${dataFormat}',
              ${JSON.stringify(v.config)})
          `,
          v.name
        );
        this.addWatch(
          screen,
          `vdata.${v.name}`,
          `if (this.canUpdate("${safeDotName}")) {
            this.${safeDotName} = value;
          }`
        );
      });
      this.addProp(screen, "vdata", null);
    },
    /**
     * Replace `.` by `_DOT_` in a variable name
     * @param {string} name
     * @returns {string}
     */
    safeDotName(name) {
      // if starts with _parent returns as is
      if (name.startsWith("_parent")) {
        return name;
      }
      return name.replace(/\./g, "_DOT_");
    }
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.dataFields(screen, definition);
      }
    });
  }
};
