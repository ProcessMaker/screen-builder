import { debounce } from "lodash";
import { findRootScreen } from "../../mixins/DataReference";

const namespaced = true;

function countErrors(obj) {
  let errors = 0;
  if (typeof obj !== "object" || !obj) {
    return errors;
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (!value || typeof value !== "object") {
      return;
    }
    if (key === "$iter") {
      return;
    }
    if ("$each" in value) {
      errors += countErrors(value.$each && value.$each.$iter);
      return;
    }
    if ("$invalid" in value && Number.isNaN(Number(key))) {
      // Nested group (object variable): count invalid children only.
      const nestedFieldKeys = Object.keys(value).filter(
        (childKey) =>
          !childKey.startsWith("$") &&
          value[childKey] &&
          typeof value[childKey] === "object" &&
          "$invalid" in value[childKey]
      );
      if (nestedFieldKeys.length > 0) {
        errors += countErrors(value);
      } else if (value.$invalid) {
        // Leaf control — count once, do not recurse into vuelidate meta.
        errors += 1;
      }
      return;
    }
    errors += countErrors(value);
  });
  return errors;
}

/**
 * Record List add/edit modals use isolated vue-form-renderers. Their ScreenContent
 * must never drive the parent screen's global submit/valid state.
 */
function isInsideIsolatedRenderer(component) {
  let node = component;
  while (node) {
    if (node.isolated === true) {
      return true;
    }
    node = node.$parent;
  }
  return false;
}

const updateValidationRules = async (screens, commit) => {
  const usableScreens = (screens || []).filter(
    (screen) => screen && !isInsideIsolatedRenderer(screen)
  );
  if (usableScreens.length === 0) {
    // When validation was restarted, or only isolated (modal) screens were
    // queued, do not touch the parent form's global valid/message state.
    return;
  }
  const rootScreen = findRootScreen(usableScreens[0]);
  if (!rootScreen || isInsideIsolatedRenderer(rootScreen)) {
    return;
  }
  const awaitLoad = [];
  usableScreens.forEach((screen) => {
    if (rootScreen !== screen && typeof screen.loadValidationRules === "function") {
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
      // Count control rules in vdata only. Adding schema on top double-counts the
      // same required checkboxes when vocabularies/json-schema mirror those fields
      // (e.g. 4 controls → "8 validation errors"). Schema still affects $invalid.
      errors += countErrors(validate.vdata);
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
  if (isInsideIsolatedRenderer(mainScreen)) {
    return;
  }
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
      if (typeof updateValidationRulesDebounced.cancel === "function") {
        updateValidationRulesDebounced.cancel();
      }
      screensToValidate.length = 0;
    },
    validate({ commit }, mainScreen) {
      queueUpdateValidationRules(mainScreen, commit);
    },
    async validateNow({ commit }, mainScreen) {
      // Cancel any pending debounced modal/parent updates so they cannot
      // overwrite this authoritative validation result.
      if (typeof updateValidationRulesDebounced.cancel === "function") {
        updateValidationRulesDebounced.cancel();
      }
      screensToValidate.length = 0;
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
