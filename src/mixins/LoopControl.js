import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("globalErrorsModule", ["unlocked"]),
    async initLoopVariable(variable, config) {
      await this.unlocked();
      if (config.settings.type === 'existing') {
        // Do not initialize any variables if the loop is
        // configured to use existing data.
        // Unless it's null, then set it to an empty array
        if (this.getValue(variable) === null) {
          this.setValue(variable, []);
        }
        return;
      }

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
