/**
 * ClipboardManager class to handle saving to and loading from
 * localStorage and the server.
 */
class ClipboardManager {

  /**
   * Callable property function that loads the clipboard from server.
   */
  static loadFromServerFn = null;

  /**
   * Callable property function that saves the clipboard to server.
   */
  static saveToServerFn = null;

  /**
   * Saves the clipboard items to localStorage.
   * @param {Array} clipboard - The clipboard items to save.
   */
  static saveToLocalStorage(clipboard) {
    localStorage.setItem('clipboard', JSON.stringify(clipboard));
  }

  /**
   * Loads the clipboard items from localStorage.
   * @returns {Array} The clipboard items.
   */
  static loadFromLocalStorage() {
    const clipboardData = localStorage.getItem('clipboard');
    if (clipboardData) {
      try {
        return JSON.parse(clipboardData);
      } catch (e) {
        console.error('Failed to parse clipboard data from localStorage:', e);
        return [];
      }
    } else {
      return [];
    }
  }

  /**
   * Saves the clipboard items to the server via POST /clipboard/create_or_update.
   * @param {Array} clipboard - The clipboard items to save.
   * @returns {Promise}
   */
  static saveToServer(clipboard) {
    // return axios.post('/clipboard/create_or_update', { clipboard });
    if (!ClipboardManager.saveToServerFn) {
      return Promise.resolve();
    }
    return ClipboardManager.saveToServerFn(clipboard);
  }

  /**
   * Loads the clipboard items from the server via GET /clipboard/get_by_user.
   * @returns {Promise<Array>} The clipboard items.
   */
  static loadFromServer() {
    if (!ClipboardManager.loadFromServerFn) {
      return Promise.resolve([]);
    }
    return ClipboardManager.loadFromServerFn()
      .then(clipboard => {
        if (Array.isArray(clipboard)) {
          return clipboard;
        } else {
          throw new Error('Invalid server response: Expected array for clipboard content');
        }
      })
      .catch(error => {
        console.error('Failed to load clipboard from server:', error);
        return [];
      });
  }
}

export default ClipboardManager;
