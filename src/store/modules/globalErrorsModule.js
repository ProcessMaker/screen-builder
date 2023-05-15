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

const updateValidationRules = async (screens, commit) => {
  const rootScreen = findRootScreen(screens[0]);
  const awaitLoad = [];
  screens.forEach((screen) => {
    if (rootScreen !== screen) {
      // refresh nested screen validation rules
      awaitLoad.push(screen.loadValidationRules());
    }
  });
  await Promise.all(awaitLoad);
  try {
    await rootScreen.loadValidationRules();
  } catch (error) {
    console.warn("There was a problem rendering the screen", error);
  }
  const validate = rootScreen.$v;
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
      message = rootScreen.$t(message, { items: errors });
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

const updateValidationRulesDebounced = debounce(updateValidationRules, 500);

const screensToValidate = [];
const queueUpdateValidationRules = (mainScreen, commit) => {
  if (!screensToValidate.includes(mainScreen)) {
    screensToValidate.push(mainScreen);
  }
  updateValidationRulesDebounced(screensToValidate, commit);
};

const globalErrorsModule = {
  namespaced,
  state: () => {
    return {
      locked: false,
      valid: true,
      message: "",
      mode: "",
      submitted: false,
      showValidationOnLoad: false,
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
    },
    showValidationErrors(state) {
      return state.showValidationOnLoad || state.submitted;
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
    validate({ commit }, mainScreen) {
      queueUpdateValidationRules(mainScreen, commit);
    },
    async validateNow({ commit }, mainScreen) {
      await updateValidationRules([mainScreen], commit);
    },
    close({ commit }) {
      commit("basic", { key: "valid", value: true });
    },
    hasSubmitted({ commit }, value) {
      commit("basic", { key: "submitted", value });
    },
    showValidationOnLoad({ commit }, value) {
      commit("basic", { key: "showValidationOnLoad", value });
    }
  }
};

export default globalErrorsModule;
