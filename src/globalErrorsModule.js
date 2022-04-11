const globalErrorsModule = {
  namespaced: true,
  state() {
    return {
      screen: {
        valid: true,
      },
    };
  },
  mutations: {
    basic(state, payload) {
      state[payload.key] = payload.value;
    },
  },
  getters: {
    isValidScreen(state) {
      return state.screen.valid;
    },
  },
  actions: {},
};

export default globalErrorsModule;