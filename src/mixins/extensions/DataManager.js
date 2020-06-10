
export default {
  methods: {
    dataFields(screen) {
      const variables = [];
      this.variables.filter(v => !this.definition.computed.find(c => c.property === v.name))
        .forEach(v => {
          variables.push(`${JSON.stringify(v.name)}: (this.vdata && this.vdata[${JSON.stringify(v.name)}]) || null`);
          this.addWatch(screen, v.name, `this.setValue(${JSON.stringify(v.name)}, value);`);
        });
      screen.props.vdata = null;
      screen.data = new Function('return {' + variables.join(',') + '};');
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
