import { Parser } from 'expr-eval';

export default {
  methods: {
    calculatedFields() {
      return new Promise(complete => {
        if (this.computed) {
          this.computed.forEach(prop => {
            let value;
            try {
              if (prop.type === 'expression') {
                value = Parser.evaluate(prop.formula, this.transientData);
              } else if (prop.type === 'javascript') {
                const func = new Function(prop.formula);
                value = func.bind(JSON.parse(JSON.stringify(this.transientData)))();
              }
            } catch (e) {
              value = String(e);
            }
            JSON.stringify(this.transientData[prop.property]) !== JSON.stringify(value) ? this.$set(this.transientData, prop.property, value) : null;
            JSON.stringify(this.data[prop.property]) !== JSON.stringify(value) ? this.$set(this.data, prop.property, value) : null;
          });
          complete();
        }
      });
    },
  },
};
