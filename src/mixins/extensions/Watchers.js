import watchersMixin from '../../mixins/watchers';

export default {
  methods: {
    addWatcherVariables() {
      if (this.definition.watchers) {
        this.definition.watchers.forEach((watcher) => {
          this.registerVariable(watcher.output_variable, {});
        });
      }
    },
    watchers(screen) {
      if (this.definition.watchers) {
        screen.mixins.push(watchersMixin);
        this.definition.watchers.forEach((watcher) => {
          this.addWatch(screen, watcher.watching, `this.queueWatcher(${JSON.stringify(watcher)});`);
        });
      }
    },
  },
  mounted() {
    this.extensions.push({
      onbuild(screen) {
        this.watchers(screen);
      },
      onparse() {
        this.addWatcherVariables();
      },
    });
  },
};
