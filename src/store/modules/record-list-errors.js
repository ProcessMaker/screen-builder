const namespaced = true;
const recordListErrorsModule = {
  namespaced,
  state: () => {
    return {
      valid: true,
      message: '',
    };
  },
  getters: {
    isValidScreen(state) {
      return state.valid;
    },
    getErrorMessage(state) {
      return state.message;
    },
  },
  mutations: {
    basic(state, payload) {
      state[payload.key] = payload.value;
    },
  },
  actions: {
    close({ commit }) {
      commit('basic', { key: 'valid', value: true });
    },
  },
};

export default recordListErrorsModule;