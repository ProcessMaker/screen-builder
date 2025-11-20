/**
 * VariablesToSubmitFilter Mixin
 * 
 * This mixin provides functionality to filter form data before submission.
 * It implements a two-layer protection system:
 * 
 * LAYER 1 (VariablesToSubmitFilter): Validates and filters data in ScreenBase
 *   - Protects against invalid vdata (null/undefined/false/array)
 *   - Normalizes invalid data to {} (empty object)
 *   - Filters variables based on variablesToSubmit configuration
 *   - Always preserves system variables (starting with _)
 * 
 * LAYER 2 (task.vue): Additional protection at the task level
 *   - Validates formData before sending to server
 *   - Uses requestData or {} as fallback if formData is invalid
 * 
 * Use Cases:
 * 1. Backward Compatibility: When variablesToSubmit is not configured,
 *    sends all vdata (original behavior)
 * 2. New Feature: When variablesToSubmit is configured, filters and sends
 *    only specified variables + system variables
 * 3. Data Protection: Ensures null/undefined/false never reaches the server
 */

export default {
  methods: {
    /**
     * Filters data for submission based on variablesToSubmit configuration
     * 
     * @param {Object|null|undefined|false} data - The form data to filter (vdata)
     * @param {Object|null} buttonInfo - Button configuration containing variablesToSubmit
     * @returns {Object} Filtered data object (never null/undefined/false)
     * 
     * LAYER 1 PROTECTION:
     * - Validates data is a valid object (not null/undefined/false/array)
     * - If invalid, normalizes to {} (empty object)
     * - Applies filtering if variablesToSubmit is configured
     * - Preserves all system variables (starting with _)
     */
    filterDataForSubmission(data, buttonInfo) {
      // PROTECTION: Ensure data is a valid object
      // If data is null, undefined, false, or array, normalize to {}
      const safeData = this.isValidObject(data) ? data : {};

      // Check if filtering is needed
      if (!this.shouldFilterVariables(buttonInfo)) {
        // Backward Compatibility: No filtering, return all data
        return safeData;
      }

      // New Feature: Filter variables
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
     * 
     * @param {*} data - Data to validate
     * @returns {boolean} True if data is a valid object, false otherwise
     * 
     * Valid: { name: 'John' }, { _parent: {...} }
     * Invalid: null, undefined, false, [], "string", 123
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
     * Determines if variable filtering should be applied
     * 
     * @param {Object|null} buttonInfo - Button configuration
     * @returns {boolean} True if filtering should be applied, false otherwise
     * 
     * Returns true only if:
     * - buttonInfo exists
     * - buttonInfo.variablesToSubmit exists
     * - buttonInfo.variablesToSubmit is a non-empty array
     * 
     * Otherwise returns false (backward compatibility: send all data)
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

