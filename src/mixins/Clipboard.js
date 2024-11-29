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
        const processItems = (items) => {
            items.forEach((item, index) => {
                // Recursively process nested arrays
                if (Array.isArray(item)) {
                    return processItems(item);
                }
    
                // Replace clipboard component with clipboard content
                if (item.component === clipboardComponentName) {
                    // Clone clipboard content to avoid modifying original data
                    const clipboardContent = _.cloneDeep(this.$store.getters["clipboardModule/clipboardItems"]);
                    
                    // Update UUIDs in clipboard content to prevent duplicate IDs
                    clipboardContent.forEach(this.updateUuids);
    
                    // Replace the clipboard component with the clipboard content
                    items.splice(index, 1, ...clipboardContent);
    
                    // Show success message if clipboard content is present
                    if (clipboardContent.length > 0) {
                        window.ProcessMaker.alert(this.$t("Clipboard Pasted Successfully"), "success");
                    }
                }
    
                // Process nested items recursively
                if (item.items) {
                    processItems(item.items);
                }
            });
        };
    
        // Initiate the processing of page items
        if (page && Array.isArray(page.items)) {
            processItems(page.items);
        } else {
            console.warn("Invalid page structure or no items to process.");
        }
      };

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
        // Update the clipboard page with the new clipboard items
        this.clipboardPage.items = this.$store.getters["clipboardModule/clipboardItems"];
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
