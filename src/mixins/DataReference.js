/**
 * Gets the screen parent or null if don't have
 * @returns {object|null}
 */
function findScreenOwner(control) {
  let owner = control;
  while (owner) {
    const isScreen = owner.$options.name === "ScreenContent";
    const nestedScreen =
      owner.$parent && owner.$parent.$parent && owner.$parent.$parent.$parent;
    const isNestedScreen =
      nestedScreen && nestedScreen.$options.name === "FormNestedScreen";
    const isRecordListModal =
      nestedScreen && nestedScreen.$options.name === "BModal";
    const isRoot =
      !isNestedScreen &&
      !isRecordListModal &&
      owner.$parent &&
      owner.$parent.$parent &&
      owner.$parent.$parent.$options.name === "VueFormRenderer";
    if ((isScreen && !isNestedScreen && owner !== control) || isRoot) {
      return owner;
    }
    if (isNestedScreen) {
      owner = nestedScreen.$parent.$parent;
    } else {
      owner = owner.$parent;
    }
  }
  return null;
}
/**
 * Wrap the data of a control using a Proxy
 * @return {object} proxy
 */
function wrapScreenData(screen, customProperties = null, setter = null) {
  const handler = {
    get: (target, name) => {
      if (customProperties && customProperties[name]) {
        return customProperties[name];
      }
      if (name === "_parent") {
        if (screen.vdata._parent !== undefined) {
          return screen.vdata._parent;
        }
        const screenOwner = findScreenOwner(screen);
        // Get _parent for the current screen (e.g. Inside Loops, Inside Tabs?, RecordLists...?)
        if (screenOwner && screenOwner !== screen) {
          return wrapScreenData(screenOwner);
        }
        return undefined;
      }
      // Check if vdata exists
      if (screen.vdata !== undefined && screen.vdata !== null) {
        return screen.vdata[name];
      }
      return undefined;
    },
    has(target, name) {
      // customProperties is used by RichText controls
      // to add custom Mustache functions
      if (customProperties && customProperties[name]) {
        return true;
      }
      if (name === "_parent") {
        return true;
      }
      // Check if vdata exists
      if (screen.vdata !== undefined && screen.vdata !== null) {
        return screen.vdata[name] !== undefined;
      }
      return false;
    },
    set(target, name, value) {
      if (setter) {
        setter(screen, name, value);
      }
    }
  };
  return new Proxy({}, handler);
}

export default {
  methods: {
    /**
     * Wrap the data of a control using a Proxy
     * @return {object} proxy
     */
    getDataReference(customProperties = null, setter = null) {
      return wrapScreenData(this, customProperties, setter);
    }
  }
};
