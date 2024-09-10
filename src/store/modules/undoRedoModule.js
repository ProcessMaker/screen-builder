const undoRedoModule = {
  namespaced: true,
  state() {
    return {
      stack: [],
      position: null
    };
  },
  getters: {
    canUndo(state) {
      return state.position > 0;
    },
    canRedo(state) {
      return state.position < state.stack.length - 1;
    },
    currentState(state, getters) {
      const currentState = state.stack[state.position];

      if (getters.nextState && getters.nextState.deletedPage) {
        currentState.currentPage = getters.nextState.currentPage;
      }

      return currentState;
    },
    nextState(state, getters) {
      if (getters.canRedo) {
        return state.stack[state.position + 1];
      }

      return false;
    }
  },
  mutations: {
    setPosition(state, position) {
      state.position = position;
    },
    setState(state, newState) {
      state.stack.push(newState);
    }
  },
  methods: {
    emitChanges() {
      window.ProcessMaker.EventBus.$emit("screen-change");
    }
  },
  actions: {
    pushState({ state, getters, commit }, newState) {
      debugger;
      if (newState.config === getters.currentState) {
        return;
      }

      commit("setState", newState);
      commit("setPosition", state.stack.length - 1);
      undoRedoModule.methods.emitChanges();
    },
    undo({ state, getters, commit }) {
      if (!getters.canUndo) {
        return;
      }

      commit("setPosition", state.position - 1);
      undoRedoModule.methods.emitChanges();
    },
    redo({ state, getters, commit }) {
      if (!getters.canRedo) {
        return;
      }

      commit("setPosition", state.position + 1);
      undoRedoModule.methods.emitChanges();
    }
  }
};

export default undoRedoModule;
