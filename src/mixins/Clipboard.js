import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

export default {
  methods: {
    /**
     * Handles the change event, ensuring that the added element has a unique UUID.
     * 
     * @param {Object} added - The added item object containing the `element`.
     * @returns {void}
     */
    onChange({ added }) {
      if (!added || !added.element) {
        console.error('Invalid item or element passed to onChange');
        return; // Prevent further execution if the element is invalid
      }
      const element = added.element;

      // Ensure element does not already have a UUID or generate a new one if missing
      if (!element.uuid) {
        element.uuid = uuidv4(); // Assign a unique identifier to the element
      } else {
        console.warn('Element already has a UUID:', element.uuid);
      }
    },

    /**
     * Adds a deep-cloned item to the clipboard, ensuring the original item is unmodified.
     * 
     * @param {Object} item - The item to add to the clipboard.
     * @returns {void}
     */
    addToClipboard(item) {
      const duplicate = _.cloneDeep(item); // Create a deep copy of the item
      this.$store.dispatch("clipboardModule/addToClipboard", duplicate); // Dispatch action to add item to the Vuex store
    },

    /**
     * Removes the specified item from the clipboard.
     * 
     * @param {Object} item - The item to remove from the clipboard.
     * @returns {void}
     */
    removeFromClipboard(item) {
      this.$store.dispatch("clipboardModule/removeFromClipboard", item); // Dispatch action to remove item from the Vuex store
    },

    /**
     * Checks if the specified item is currently in the clipboard.
     * 
     * @param {Object} item - The item to check.
     * @returns {Boolean} - Returns true if the item is in the clipboard, otherwise false.
     */
    isInClipboard(item) {
      return this.$store.getters["clipboardModule/isInClipboard"](item); // Use Vuex getter to check if item exists in the clipboard
    },
  },
};
