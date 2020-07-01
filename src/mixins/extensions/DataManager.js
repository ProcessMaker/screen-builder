
export default {
  methods: {
    dataFields(screen) {
      this.variables.filter(v => !(this.definition.computed && this.definition.computed.find(c => c.property === v.name)))
        .forEach(v => {
          this.addData(screen, v.name, `this.getValue(${JSON.stringify(v.name)}, this.vdata) || this.getValue(${JSON.stringify(v.name)}, data) || null`);
          this.addWatch(screen, v.name, `this.setValue(${JSON.stringify(v.name)}, value, this.vdata);`);
        });
      screen.props.vdata = null;
    },
  },
  mounted() {
    this.extensions.push({
      onbuild(screen) {
        this.dataFields(screen);
      },
    });
  },
};
