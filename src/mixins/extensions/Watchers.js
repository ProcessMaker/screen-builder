import watchersMixin from '../../mixins/watchers';

export default {
  methods: {
    addWatcherVariables(definition) {
      if (definition.watchers) {
        definition.watchers.forEach((watcher) => {
          this.registerVariable(watcher.output_variable, {});
        });
      }
    },
    watchers(screen, definition) {
      if (definition.watchers) {
        screen.mixins.push(watchersMixin);
        definition.watchers.forEach((watcher) => {
          this.addMounted(screen, `
            this.$watch('${watcher.watching}', () => {
              this.queueWatcher(${JSON.stringify(watcher)});
            });
          `);
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
