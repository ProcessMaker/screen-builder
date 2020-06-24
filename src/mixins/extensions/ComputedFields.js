import computedFields from '../computedFields';

export default {
  methods: {
    computedFields(screen) {
      screen.mixins.push(computedFields);
      this.definition.computed.forEach(computed => {
        screen.computed[computed.property] = {
          get: computed.type === 'expression' ? new Function(`return this.evaluateExpression(${JSON.stringify(computed.formula)});`) : new Function(computed.formula),
          set() {},
        };
        this.addWatch(screen, computed.property, `this.setValue(${JSON.stringify(computed.property)}, value);`);
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
