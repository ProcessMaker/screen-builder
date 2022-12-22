import { debounce } from "lodash";
import { findRootScreen } from "../../mixins/DataReference";

const namespaced = true;

function countErrors(obj) {
  let errors = 0;
  if (typeof obj !== "object") {
    return errors;
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      if (typeof value === "object" && "$each" in value) {
        errors += countErrors(value.$each.$iter);
        return;
      }
      if (
        key !== "$iter" &&
        typeof value === "object" &&
        "$invalid" in value &&
        value.$invalid &&
        Number.isNaN(Number(key))
      ) {
        errors++;
      }
      if (key !== "$iter" && value) {
        errors += countErrors(value);
      }
    }
  });
  return errors;
}

const updateValidationRules = async (screen, commit) => {
  const mainScreen = findRootScreen(screen);
  try {
    await mainScreen.loadValidationRules();
  } catch (error) {
    if (this.getMode === "preview") {
      console.warn("There was a problem rendering the screen", error);
    }
  }
  const validate = mainScreen.$v;
  // update the global error state used by submit buttons
  if (validate) {
    let errors = 0;
    let message = "";
    if (validate.$invalid) {
      errors += countErrors(validate.vdata);
      errors += countErrors(validate.schema);
      message =
        errors === 1
          ? "There is a validation error in your form."
          : "There are {{items}} validation errors in your form.";
      message = mainScreen.$t(message, { items: errors });
    }
    commit("basic", {
      key: "valid",
      value: !validate.$invalid
    });
    commit("basic", {
      key: "message",
      value: message
    });
  }
};

const updateValidationRulesDebounced = debounce(updateValidationRules, 1000);

const globalErrorsModule = {
  namespaced,
  state: () => {
    return {
      locked: false,
      valid: true,
      message: "",
      mode: ""
    };
  },
  getters: {
    isValidScreen(state) {
      return state.valid;
    },
    getErrorMessage(state) {
      return state.message;
    },
    getMode(state) {
      return state.mode;
    }
  },
  mutations: {
    basic(state, payload) {
      state[payload.key] = payload.value;
    },
    setMode(state, mode) {
      state.mode = mode;
    }
  },
  actions: {
    lockActions({ commit }) {
      commit("basic", {
        key: "locked",
        value: true
      });
    },
    unlockActions({ commit }) {
      commit("basic", {
        key: "locked",
        value: false
      });
    },
    async unlocked({ getters }) {
      if (!getters.locked) {
        return true;
      }
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!getters.locked) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    },
    validate({ commit }, mainScreen) {
      updateValidationRulesDebounced(mainScreen, commit);
    },
    async validateNow({ commit }, mainScreen) {
      await updateValidationRules(mainScreen, commit);
    },
    close({ commit }) {
      commit("basic", { key: "valid", value: true });
    },
  }
};

export default globalErrorsModule;
