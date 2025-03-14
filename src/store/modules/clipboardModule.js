import { v4 as uuidv4 } from 'uuid';
import ClipboardManager from './ClipboardManager';

/**
 * Vuex module for managing clipboard state with localStorage synchronization.
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
      /**
       * @type {Array} Array to store clipboard items.
       */
      clipboard: [],
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
     * Checks if an item with a specific uuid is present in the clipboard.
     * @param {Object} state - The state of the module.
     * @returns {Function} Function to check item presence.
     */
    isInClipboard: state => item => {
      if (!item || !item.uuid) {
        // If the item is invalid or doesn't have an uuid, return false
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
     * Sets the entire clipboard state.
     * @param {Object} state - The state of the module.
     * @param {Array} clipboard - The new clipboard array.
     */
    SET_CLIPBOARD(state, clipboard) {
      if (!Array.isArray(clipboard)) {
        throw new Error('Clipboard content must be an array');
      }
      state.clipboard.splice(0, state.clipboard.length, ...clipboard);
    },

    /**
     * Adds items to the clipboard.
     * @param {Object} state - The state of the module.
     * @param {any} items - The items to add.
     */
    ADD_TO_CLIPBOARD(state, items) {
      console.log("ADD_TO_CLIPBOARD", items);
      const itemsToAdd = Array.isArray(items) ? items : [items];
      itemsToAdd.forEach(item => {
        if (!item.uuid) {
          item.uuid = uuidv4();
        }
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
        console.error('Item or item uuid is missing');
        return;
      }
      const index = state.clipboard.findIndex(clipboardItem => clipboardItem.uuid === item.uuid);
      if (index !== -1) {
        state.clipboard.splice(index, 1);
      }
    },

    /**
     * Clears all items from the clipboard.
     * @param {Object} state - The state of the module.
     */
    CLEAR_CLIPBOARD(state) {
      state.clipboard.splice(0, state.clipboard.length);
    },
  },

  /**
   * Actions are used to commit mutations and can contain asynchronous operations.
   */
  actions: {
    /**
     * Initializes the clipboard by loading from localStorage and server,
     * and setting up the storage event listener.
     * @param {Object} context - The Vuex context.
     */
    initializeClipboard({ commit }) {
      // Load from localStorage
      const clipboard = ClipboardManager.loadFromLocalStorage();
      commit('SET_CLIPBOARD', clipboard);

      // Load from server and update state
      ClipboardManager.loadFromServer().then(serverClipboard => {
        if (serverClipboard.length > 0) {
          commit('SET_CLIPBOARD', serverClipboard);
          ClipboardManager.saveToLocalStorage(serverClipboard);
        }
      });

      // Set up storage event listener
      window.addEventListener('storage', event => {
        if (event.key === 'clipboard') {
          const clipboard = ClipboardManager.loadFromLocalStorage();
          commit('SET_CLIPBOARD', clipboard);
        }
      });
    },

    /**
     * Setup saveToServerFn
     * @param {Object} context - The Vuex context.
     * @param {Function} saveToServerFn - The function to save the clipboard to the server.
     */
    setupSaveToServerFn({ commit }, saveToServerFn) {
      ClipboardManager.saveToServerFn = saveToServerFn;
    },

    /**
     * Setup loadFromServerFn
     * @param {Object} context - The Vuex context.
     * @param {Function} loadFromServerFn - The function to load the clipboard from the server.
     */
    setupLoadFromServerFn({ commit }, loadFromServerFn) {
      ClipboardManager.loadFromServerFn = loadFromServerFn;
    },

    /**
     * Adds an item to the clipboard.
     * Updates localStorage and the server.
     * @param {Object} context - The Vuex context.
     * @param {any} item - The item to add.
     */
    addToClipboard({ commit, state }, item) {
      if (!item) {
        throw new Error('Item is missing');
      }
      commit('ADD_TO_CLIPBOARD', item);
      // Save to localStorage and server
      ClipboardManager.saveToLocalStorage(state.clipboard);
      ClipboardManager.saveToServer(state.clipboard);
    },

    pushState({ commit, state }, clipboard) {
      commit('SET_CLIPBOARD', clipboard);
      // Save to localStorage and server
      ClipboardManager.saveToLocalStorage(state.clipboard);
      ClipboardManager.saveToServer(state.clipboard);
    },

    /**
     * Removes an item from the clipboard.
     * Updates localStorage and the server.
     * @param {Object} context - The Vuex context.
     * @param {any} item - The item to remove.
     */
    removeFromClipboard({ commit, state }, item) {
      commit('REMOVE_FROM_CLIPBOARD', item);
      // Save to localStorage and server
      ClipboardManager.saveToLocalStorage(state.clipboard);
      ClipboardManager.saveToServer(state.clipboard);
    },

    /**
     * Clears all items from the clipboard.
     * Updates localStorage and the server.
     * @param {Object} context - The Vuex context.
     */
    clearClipboard({ commit, state }) {
      commit('CLEAR_CLIPBOARD');
      // Save to localStorage and server
      ClipboardManager.saveToLocalStorage(state.clipboard);
      ClipboardManager.saveToServer(state.clipboard);
    },
  },
};

export default clipboardModule;
