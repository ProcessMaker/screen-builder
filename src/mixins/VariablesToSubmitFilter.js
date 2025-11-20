/**
 * VariablesToSubmitFilter Mixin
 * 
 * Filters form data before submission based on button configuration.
 * Protects against invalid data (null/undefined/false) and preserves system variables.
 */

export default {
  methods: {
    /**
     * Filters data for submission based on variablesToSubmit configuration
     * @param {Object} data - Form data to filter
     * @param {Object} buttonInfo - Button configuration with optional variablesToSubmit array
     * @returns {Object} Filtered data (always returns a valid object)
     */
    filterDataForSubmission(data, buttonInfo) {
      // Normalize invalid data to empty object
      const safeData = this.isValidObject(data) ? data : {};

      // No filtering: return all data (backward compatibility)
      if (!this.shouldFilterVariables(buttonInfo)) {
        return safeData;
      }

      // Apply filtering
      const variablesToSubmit = buttonInfo.variablesToSubmit;
      const filteredData = {};

      // Add requested variables
      variablesToSubmit.forEach(variableName => {
        if (variableName in safeData) {
          filteredData[variableName] = safeData[variableName];
        }
      });

      // Always preserve system variables (starting with _)
      Object.keys(safeData).forEach(key => {
        if (key.startsWith('_')) {
          filteredData[key] = safeData[key];
        }
      });

      return filteredData;
    },

    /**
     * Checks if data is a valid plain object
     * @param {*} data - Data to validate
     * @returns {boolean} True if valid object, false otherwise
     */
    isValidObject(data) {
      return (
        data !== null &&
        data !== undefined &&
        data !== false &&
        typeof data === 'object' &&
        !Array.isArray(data)
      );
    },

    /**
     * Checks if filtering should be applied
     * @param {Object} buttonInfo - Button configuration
     * @returns {boolean} True if filtering enabled, false otherwise
     */
    shouldFilterVariables(buttonInfo) {
      return (
        buttonInfo &&
        buttonInfo.variablesToSubmit &&
        Array.isArray(buttonInfo.variablesToSubmit) &&
        buttonInfo.variablesToSubmit.length > 0
      );
    }
  }
};

