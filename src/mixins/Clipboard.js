import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

const clipboardComponentName = "Clipboard";

export default {
  data() {
    return {
      showClipboard: false,
    };
  },
  methods: {
    /**
     * Adds a deep-cloned item to the clipboard, ensuring the original item is unmodified.
     * 
     * @param {Object} item - The item to add to the clipboard.
     * @returns {void}
     */
    addToClipboard(item) {
      const duplicate = _.cloneDeep(item); // Create a deep copy of the item
      this.$store.dispatch("clipboardModule/addToClipboard", duplicate); // Dispatch action to add item to the Vuex store
      this.$root.$emit('update-clipboard');
    },

    /**
     * Removes the specified item from the clipboard.
     * 
     * @param {Object} item - The item to remove from the clipboard.
     * @returns {void}
     */
    removeFromClipboard(item) {
      this.$store.dispatch("clipboardModule/removeFromClipboard", item); // Dispatch action to remove item from the Vuex store
      this.$root.$emit('update-clipboard');
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

    /**
     * Generate a unique UUID for the specified item.
     */
    generateUUID() {
      return uuidv4(); // Generate a unique identifier using UUID v4
    },

    /**
     * Add a UUID to each element in the screen configuration.
     *
     * @param array screenConfig 
     */
    addUuidToElements(screenConfig) {
      const replaceInPage = (page) => {
        page.items.forEach((item, index) => {
          if (item instanceof Array) {
            // multi-column each item in the column
            replaceInPage({ items: item });
          } else {
            // loop through children
            if (!item.uuid) {
              item.uuid = this.generateUUID();
            }
            if (item.items) {
              replaceInPage(item);
            }
          }
        });
      }

      screenConfig.forEach((item) => replaceInPage(item));
    },

    /**
     * Setup or update UUID for the item and its children.
     *
     * @param {*} item Control item in the screen configuration
     */
    updateUuids(item) {
      item.uuid = this.generateUUID();
      if (item.items) {
        item.items.forEach(item => {
          if (item instanceof Array) {
            // multi-column each item in the column
            item.forEach(this.updateUuids)
          } else {
            // loop through children
            this.updateUuids(item);
          }
        })
      }
    },

    /**
     * Find { component: "Clipboard" } and replace with the clipboard content.
     */
    replaceClipboardContent(screenConfig) {
      if (
        !screenConfig
        || screenConfig instanceof Array === false
      ) {
        throw new Error("Expected a screen configuration array");
      }

      const replaceInPage = (page) => {
        page.items.forEach((item, index) => {
          if (item.component === clipboardComponentName) {
            // clone clipboard content to avoid modifying the original
            const clipboardContent = _.cloneDeep(this.$store.getters["clipboardModule/clipboardItems"]);
            // replace uuids in clipboard content
            clipboardContent.forEach(this.updateUuids);
            page.items.splice(index, 1, ...clipboardContent);
            if (clipboardContent.length) {
              window.ProcessMaker.alert(this.$t("Clipboard Pasted Succesfully"), "success");
            }
          }
          if (item.items) {
            replaceInPage(item);
          }
        });
      }
      screenConfig.forEach((item) => replaceInPage(item));
    },

    /**
     * Clear the clipboard
     */
    async clearClipboard() {
      const confirm = await this.$bvModal.msgBoxConfirm(
        this.$t("Deleting the clipboard will permanently remove all information, and you will need to copy all components again."),
        {
          title: this.$t("Are you sure you want to clear clipboard?"),
          size: "md",
          buttonSize: "sm",
          okVariant: "primary py-2 px-4",
          cancelVariant: "outline-secondary py-2 px-4",
          okTitle: this.$t("Confirm"),
          cancelTitle: this.$t("Cancel"),
          footerClass: "p-2 border-0",
          hideHeaderClose: true,
          centered: true,
        }
      );
      if (confirm) {
        this.$store.dispatch("clipboardModule/clearClipboard");
        this.$root.$emit('update-clipboard');
      }
    },

    /**
     * Close Clipboard
     */
    closeClipboard() {
      this.showClipboard = false;
    },
  },
};
