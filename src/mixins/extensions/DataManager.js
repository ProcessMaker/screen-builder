
export default {
  methods: {
    dataFields(screen, definition) {
      this.variables.filter(v => !(definition.computed && definition.computed.find(c => c.property === v.name)))
        .forEach(v => {
          this.addData(screen, v.name, `this.getValue(${JSON.stringify(v.name)}, this.vdata) || this.getValue(${JSON.stringify(v.name)}, data) || null`);
          this.addWatch(screen, v.name, `this.setValue(${JSON.stringify(v.name)}, value, this.vdata);`);
          this.addWatch(screen, `vdata.${v.name}`, `this.${v.name} = this.vdata.${v.name};`);
        });
      screen.props.vdata = null;
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.dataFields(screen, definition);
      },
    });
  },
};
