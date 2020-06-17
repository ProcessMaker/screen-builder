
export default {
  methods: {
    dataFields(screen) {
      this.variables.filter(v => !this.definition.computed.find(c => c.property === v.name))
        .forEach(v => {
          this.addData(screen, v.name, `(this.vdata && this.vdata[${JSON.stringify(v.name)}]) || null`);
          this.addWatch(screen, v.name, `this.setValue(${JSON.stringify(v.name)}, value);`);
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
