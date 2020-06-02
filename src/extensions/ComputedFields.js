export default {
  data() {
    return {
      extensions: {'computedFields': true},
    };
  },
  methods: {
    computedFields(screen) {
      this.definition.computed.forEach(computed => {
        screen.computed[computed.property] = {
          get: new Function(computed.formula),
          set() {},
        };
        screen.watch[computed.property] = (function(computed) { return function(value) {
          this.$set(this['vdata'], computed.property, value);
        };})(computed);
        this.$set(this.value, computed.property, '');
      });
    },
  },
};
