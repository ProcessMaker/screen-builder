import computedFields from '../computedFields';

export default {
  methods: {
    computedFields(screen, definition) {
      // Add computed fields
      screen.mixins.push(computedFields);

      for (const computed of definition.computed) {
        screen.computed[computed.property] = {
          get: (() => {
            const formula = JSON.stringify(computed.formula);
            const type = JSON.stringify(computed.type);

            return new Function(`return this.evaluateExpression(${formula}, ${type});`);
          })(),
          set() {
            // Do nothing (as it's not allowed)
          },
        };

        this.addWatch(
          screen,
          computed.property,
          `this.setValue(${JSON.stringify(computed.property)}, value, this.vdata);`
        );
      }
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        if (definition.computed) {
          this.computedFields(screen, definition);
        }
      },
    });
  },
};
