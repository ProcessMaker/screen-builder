import computedFields from '../computedFields';

export default {
  methods: {
    computedFields(screen) {
      screen.mixins.push(computedFields);
      this.definition.computed.forEach(computed => {
        screen.computed[computed.property] = {
          get: new Function(`return this.evaluateExpression(${JSON.stringify(computed.formula)}, ${JSON.stringify(computed.type)});`),
          set() {},
        };
        this.addWatch(screen, computed.property, `this.setValue(${JSON.stringify(computed.property)}, value, this.vdata);`);
      });
    },
  },
  mounted() {
    this.extensions.push({
      onbuild(screen) {
        if (this.definition.computed) {
          this.computedFields(screen);
        }
      },
    });
  },
};
