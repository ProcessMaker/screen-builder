import watchersMixin from '../../mixins/watchers';

export default {
  methods: {
    filterWatchers(watcher) {
      const inContext = !watcher.watching || this.variables.find(({name}) => name === watcher.watching);
      return inContext;
    },
    addWatcherVariables(definition) {
      if (definition.watchers) {
        definition.watchers.filter(this.filterWatchers).forEach((watcher) => {
          const inContext = !watcher.watching || this.variables.find(({name}) => name === watcher.watching);
          if (inContext) {
            this.registerVariable(watcher.output_variable, {});
          }
        });
      }
    },
    watchers(screen, definition) {
      if (definition.watchers) {
        screen.mixins.push(watchersMixin);
        definition.watchers.filter(this.filterWatchers).forEach((watcher) => {
          this.addMounted(screen, `
            this.$nextTick(() => this.$watch('${watcher.watching}', (newValue) => {
              if (typeof newValue !== 'undefined') {
                this.queueWatcher(${JSON.stringify(watcher)});
              }
            }));
          `);

          if (watcher.run_onload) {
            this.addMounted(screen, `
                this.queueWatcher(${JSON.stringify(watcher)});
          `);
          }
        });
      }
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.watchers(screen, definition);
      },
      onparse({ definition }) {
        this.addWatcherVariables(definition);
      },
    });
  },
};
