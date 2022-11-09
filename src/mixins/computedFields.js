import { Parser } from "expr-eval";

/**
 * Gets the screen parent or null if don't have
 * @returns {object|null}
 */
function findScreenOwner(control) {
  let owner = control.$parent;
  while (owner) {
    const isScreen = owner.$options.name === "ScreenContent";
    const nestedScreen =
      owner.$parent && owner.$parent.$parent && owner.$parent.$parent.$parent;
    const isNestedScreen =
      nestedScreen &&
      nestedScreen.$options._componentTag === "form-nested-screen";
    if (isScreen && !isNestedScreen) {
      return owner;
    }
    if (isNestedScreen) {
      owner = nestedScreen;
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
function wrapScreenData(screen, customFunctions = null) {
  const handler = {
    get: (target, name) => {
      if (customFunctions && customFunctions[name]) {
        return customFunctions[name];
      }
      if (name === "_parent") {
        const screenOwner = findScreenOwner(screen);
        // Get _parent for the current screen (e.g. Inside Loops, Inside Tabs?, RecordLists...?)
        if (screenOwner) {
          return wrapScreenData(screenOwner);
        }
        if (screen.vdata) {
          return screen.vdata._parent;
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
      // customFunctions is used by RichText controls
      // to add custom Mustache functions
      if (screen.customFunctions && screen.customFunctions[name]) {
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
    }
  };
  return new Proxy({}, handler);
}

export default {
  methods: {
    evaluateExpression(expression, type) {
      const self = this;
      let value = null;

      try {
        // Monitor if variable belongs to data (defined variables) or
        // vdata (external variables)in this way the event is not
        // executed again when the variable is update

        const data = new Proxy(
          {},
          {
            get(data, name) {
              if (name === "_parent") {
                // Recursive access to _parent
                const screen = findScreenOwner(self);
                const parentScreen = findScreenOwner(screen);
                return wrapScreenData(parentScreen);
              }
              if (self.vdata[name] !== undefined) {
                return self.vdata[name];
              }
              return self[name];
            },
            set() {
              throw new Error(
                "You are not allowed to set properties from inside an expression"
              );
            }
          }
        );

        if (type === "expression") {
          value = Parser.evaluate(expression, data);
        } else {
          // eslint-disable-next-line no-new-func
          value = new Function(expression).bind(data)();
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }

        return value;
      } catch (e) {
        console.warn("There was a problem evaluating the expression", e);
      }
    }
  }
};
