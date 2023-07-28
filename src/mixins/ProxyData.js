/**
 * Gets the screen parent or null if don't have
 * @returns {object|null}
 */
function findScreenOwner(control) {
  let owner = control.$parent;
  while (owner) {
    const isScreen = owner.$options.name === "ScreenContent";
    if (isScreen) {
      return owner;
    }
    owner = owner.$parent;
  }
  return null;
}

export default {
  methods: {
    /**
     * Create a proxy for an empty object in order to avoid unexpected refresh
     *
     * @return {object} proxy
     */
    makeProxyData() {
      const control = this;
      const screen = findScreenOwner(control);
      return screen ? screen.getDataReference(control.customFunctions) : null;
    }
  }
};
