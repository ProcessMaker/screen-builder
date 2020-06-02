
export default {
  methods: {
    dataFields(screen) {
      const variables = {};
      this.variables.filter(v => !this.definition.computed.find(c => c.property === v.name))
        .forEach(v => {
          variables[v.name] = v.value;
          // initialize fields in screen data
          this.$set(this.value, v.name, v.value);
          //screen.props[v.name] = null;
          screen.watch[v.name] = (function(v) { return function(value) {
            this.$set(this['vdata'], v.name, value);
          };})(v);
        });
      screen.props.vdata = null;
      screen.data = new Function('return ' + JSON.stringify(variables) + ';');
    },
  },
};
