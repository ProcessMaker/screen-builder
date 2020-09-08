export default {
  methods: {
    initLoopVariable(variable, config) {
      let array = this.getValue(variable);
      if (!array) {
        const times = Number(config.settings.times);
        array = [];
        for (let i = 0; i < times; i++) array.push({});
      }
      this.setValue(variable, array);
    },
  },
};
