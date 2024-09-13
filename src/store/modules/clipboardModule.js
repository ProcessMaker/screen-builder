/**
 * Vuex module for managing clipboard state.
 */
const clipboardModule = {
  /**
   * Indicates that this module is namespaced, which means
   * all its state, mutations, actions, and getters will be 
   * scoped to this module.
   */
  namespaced: true,

  /**
   * The state of the clipboard module.
   * @returns {Object} The initial state of the clipboard.
   */
  state() {
    return {
      clipboard: [],  // Array to store clipboard content
    };
  },

  /**
   * Getters provide read-only access to the state.
   */
  getters: {
    /**
     * Returns all items in the clipboard.
     * @param {Object} state - The state of the module.
     * @returns {Array} The array of clipboard items.
     */
    clipboardItems: state => state.clipboard,

    /**
     * Checks if an item with a specific id is present in the clipboard.
     * @param {Object} state - The state of the module.
     * @param {Object} item - The item to check (it can contain an id or any unique property).
     * @returns {boolean} True if the item with the same id is in the clipboard, false otherwise.
     */
    isInClipboard: state => item => {
      if (!item || !item.uuid) {
        // If the item is invalid or doesn't have an id, return false
        return false;
      }
      return state.clipboard.some(clipboardItem => clipboardItem.uuid === item.uuid);
    },
  },

  /**
   * Mutations are used to modify the state.
   */
  mutations: {
    /**
     * Adds an items to the clipboard.
     * @param {Object} state - The state of the module.
     * @param {any} items - The items to add.
     */
    ADD_TO_CLIPBOARD(state, items) {
      // Check if the input is an array, if not, wrap it as an array
      const itemsToAdd = Array.isArray(items) ? items : [items];

      // Add each item only if it's not already in the clipboard
      itemsToAdd.forEach(item => {
        if (!state.clipboard.some(clipboardItem => clipboardItem.uuid === item.uuid)) {
          state.clipboard.push(item);
        }
      });
    },

    /**
     * Removes a specific item from the clipboard.
     * @param {Object} state - The state of the module.
     * @param {any} item - The item to remove.
     */
    REMOVE_FROM_CLIPBOARD(state, item) {
      if (!item || !item.uuid) {
        console.error('Item or item id is missing');
        return;
      }
      
      state.clipboard = state.clipboard.filter(clipboardItem => clipboardItem.uuid !== item.uuid);
    },

    /**
     * Clears all items from the clipboard.
     * @param {Object} state - The state of the module.
     */
    CLEAR_CLIPBOARD(state) {
      state.clipboard = [];
    },
  },

  /**
   * Actions are used to commit mutations and can contain asynchronous operations.
   */
  actions: {
    addToClipboard({ commit }, items) {
      commit('ADD_TO_CLIPBOARD', items);
    },
    /**
     * Adds an item to the clipboard by committing the corresponding mutation.
     * @param {Object} context - The context object containing commit.
     * @param {any} item - The item to add to the clipboard.
     */
    addToClipboard({ commit }, item) {
      commit('ADD_TO_CLIPBOARD', item);
    },

    /**
     * Removes an item from the clipboard by committing the corresponding mutation.
     * @param {Object} context - The context object containing commit.
     * @param {any} item - The item to remove from the clipboard.
     */
    removeFromClipboard({ commit }, item) {
      commit('REMOVE_FROM_CLIPBOARD', item);
    },

    /**
     * Clears all items from the clipboard by committing the corresponding mutation.
     * @param {Object} context - The context object containing commit.
     */
    clearClipboard({ commit }) {
      commit('CLEAR_CLIPBOARD');
    },
  },

  /**
   * Methods are not a standard part of Vuex modules but can be used for custom functionality.
   */
  methods: {
    /**
     * Emits a custom event using the EventBus.
     */
    emitChanges() {
      window.ProcessMaker.EventBus.$emit("screen-change");
    }
  },
};

export default clipboardModule;
