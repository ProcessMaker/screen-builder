const clipboardModule = {
  namespaced: true,
  state() {
    return {
      clipboard: [],  // Array to store clipboard content
    };
  },
  getters: {
    clipboardItems: state => state.clipboard,  // Get all clipboard items
    isInClipboard: state => item => state.clipboard.includes(item),  // Check if item is in clipboard
  },
  mutations: {
    ADD_TO_CLIPBOARD(state, item) {
      state.clipboard.push(item);  // Add item to the clipboard
    },
    REMOVE_FROM_CLIPBOARD(state, item) {
      state.clipboard = state.clipboard.filter(i => i !== item);  // Remove item from clipboard
    },
    CLEAR_CLIPBOARD(state) {
      state.clipboard = [];  // Clear all clipboard items
    },
  },
  methods: {
    emitChanges() {
      window.ProcessMaker.EventBus.$emit("screen-change");
    }
  },
  actions: {
    addToClipboard({ commit }, item) {
      commit('ADD_TO_CLIPBOARD', item);  // Call mutation to add item
    },
    removeFromClipboard({ commit }, item) {
      commit('REMOVE_FROM_CLIPBOARD', item);  // Call mutation to remove item
    },
    clearClipboard({ commit }) {
      commit('CLEAR_CLIPBOARD');  // Call mutation to clear the clipboard
    },
  },
};

export default clipboardModule;
