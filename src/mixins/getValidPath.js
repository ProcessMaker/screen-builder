export default {
  methods: {
    getValidPath(objectPath) {
      return this.objectPathHasError(objectPath)
        ? `["${objectPath}"]`
        : objectPath;
    },
    objectPathHasError(objectPath) {
      try {
        this.$vueSet({}, objectPath);
        return false;
      } catch (error) {
        return true;
      }
    },
  },
};
