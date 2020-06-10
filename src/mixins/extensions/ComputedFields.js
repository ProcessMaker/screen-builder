export default {
  methods: {
    computedFields(screen) {
      this.definition.computed.forEach(computed => {
        screen.computed[computed.property] = {
          get: new Function(computed.formula),
          set() {},
        };
        this.addWatch(screen, computed.property, `this.setValue(${JSON.stringify(computed.property)}, value);`);
      });
    },
  },
  mounted() {
    this.extensions.push({
      onbuild(screen) {
        this.computedFields(screen);
      },
    });
  },
};
