const undoRedoModule = {
  namespaced: true,
  state() {
    return {
      stack: [],
      position: null,
    }
  },
  getters: {
    canUndo(state) {
      return state.position > 0;
    },
    canRedo(state) {
      return state.position < state.stack.length - 1;
    },
    currentState(state) {
      return state.stack[state.position];
    },
  },
  mutations: {
    setPosition(state, position) {
      state.position = position;
    },
    setState(state, newState) {
      state.stack = state.stack.slice(0, state.position + 1);
      state.stack.push(newState);
    },
  },
  actions: {
    pushState({ state, getters, commit }, newState) {
      if (newState === getters.currentState) {
        return;
      }

      commit('setState', newState);
      commit('setPosition', state.stack.length - 1);
    },
    undo({ state, getters, commit }) {
      if (!getters.canUndo) {
        return;
      }

      commit('setPosition', state.position - 1);
    },
    redo({ state, getters, commit }) {
      if (!getters.canRedo) {
        return;
      }

      commit('setPosition', state.position + 1);
    },
  },
};

export default undoRedoModule;
