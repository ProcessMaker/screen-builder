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
  if (screens.length === 0) {
    // When validation was restarted, the screens array is empty
    // and we don't need to do anything
    return;
  }
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

const disableSubmitOnPhotoVideoUpload = async (commit, payload) => {
  commit('basic', {key: 'valid', value: !payload.value});
  commit('disableSubmit', {key: 'disableSubmit', value: payload.value});
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
      disableSubmit: false
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
    },
    disableSubmit(state, payload) {
      state['disableSubmit'] = payload.value;
      state['message'] = payload.message;
    }
  },
  actions: {
    restartValidation() {
      screensToValidate.length = 0;
    },
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
    },
    async disableSubmitOnPhotoVideoUpload({commit}, payload) {
      await disableSubmitOnPhotoVideoUpload(commit, payload);
    }
  }
};

export default globalErrorsModule;
