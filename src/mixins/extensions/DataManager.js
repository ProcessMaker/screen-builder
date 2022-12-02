import _ from "lodash";

export default {
  methods: {
    dataFields(screen, definition) {
      this.variables
        .filter(
          (v) =>
            !v.name.startsWith("_parent") &&
            !v.name.includes("._parent.") &&
            !this.isComputedVariable(v.name, definition)
        )
        .forEach((v) => {
          const { component } = v.element;
          const dataFormat = v.config.dataFormat || null;
          this.addData(
            screen,
            v.name,
            `
            this.getValue(${JSON.stringify(v.name)}, this.vdata) || 
            this.getValue(${JSON.stringify(v.name)}, data) || 
            this.initialValue('${component}', '${dataFormat}', ${JSON.stringify(
              v.config
            )})
          `
          );
          const updateMethod = `update${_.upperFirst(v.name)}`;
          this.addMethod(
            screen,
            updateMethod,
            ["value"],
            `this.setValue(${JSON.stringify(v.name)}, value, this.vdata);
            this.setValue(${JSON.stringify(v.name)}, value, this.schema);
            this.unlockActions();`,
            { debounced: 210}
          );
          this.addWatch(screen, v.name, `this.lockActions();this.${updateMethod}(value);`);
          this.addWatch(
            screen,
            `vdata.${v.name}`,
            `this.setValue(${JSON.stringify(v.name)}, value, this);`
          );
        });
      screen.props.vdata = null;
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
