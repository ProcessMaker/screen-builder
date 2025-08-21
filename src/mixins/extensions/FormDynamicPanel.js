export default {
  props: {
    configRef: null,
    loopContext: null
  },
  data() {
    return {
    };
  },
  methods: {
    /**
     * Builds the nested configuration for dynamic panel items
     * @param {Object} element - The dynamic panel element
     * @returns {Object} The nested configuration
     */
    buildNestedConfig(element) {
      return {
        config: [
          {
            items: element.items,
          }
        ],
        watchers: [], 
        isMobile: false
      };
    },

    /**
     * Creates expressions for value and loop context based on index availability
     * @param {string} variableName - The variable name
     * @param {string} index - The index name
     * @returns {Object} Object containing valueExpression and loopContextExpression
     */
    buildExpressions(variableName, index) {
      if (index && index.trim()) {
        return {
          valueExpression: `${variableName} && ${variableName}[${index}]`,
          loopContextExpression: `'${variableName} && ${variableName}[${index}]'`
        };
      }
      
      return {
        valueExpression: variableName,
        loopContextExpression: `'${variableName}'`
      };
    },

    /**
     * Creates a ScreenRenderer component for the dynamic panel
     * @param {Object} nested - The nested configuration
     * @param {string} valueExpression - The value expression
     * @param {string} loopContextExpression - The loop context expression
     * @param {Object} definition - The definition object
     * @returns {Object} The created component
     */
    createScreenRenderer(nested, valueExpression, loopContextExpression, definition) {
      return this.createComponent("ScreenRenderer", {
        ":definition": this.byRef(nested),
        ":value": valueExpression,
        ":loop-context": loopContextExpression,
        ":_parent": "getValidationData()",
        ":components": this.byRef(this.components),
        ":config-ref": this.byRef(this.configRef || definition.config),
        "@submit": "submitForm"
      });
    },

    /**
     * Builds the itemData property based on variable name and index
     * @param {string} variableName - The variable name
     * @param {string} index - The index name
     * @returns {string} The itemData expression
     */
    buildItemDataExpression(variableName, index) {
      if (index && index.trim()) {
        return `${variableName} && ${variableName}[${index}]`;
      }
      return variableName;
    },

    /**
     * Gets a helpful empty state message based on whether index is configured
     * @param {string} index - The index name
     * @param {string} customMessage - Custom message from settings
     * @returns {string} The appropriate empty state message
     */
    getEmptyStateMessage(index, customMessage) {
      if (customMessage) {
        return customMessage;
      }
      
      if (!index || !index.trim()) {
        console.warn('FormDynamicPanel: No Index Name configured. The dynamic panel will not function properly without an index.');
        return 'No data available. Please configure an Index Name for this dynamic panel.';
      }
      
      return 'No data available for this dynamic panel.';
    },

    /**
     * Validates that required settings are present
     * @param {Object} element - The dynamic panel element
     * @returns {boolean} True if valid, false otherwise
     */
    validateElementSettings(element) {
      if (!element.config || !element.config.settings) {
        console.warn('FormDynamicPanel: Missing config or settings');
        return false;
      }
      
      if (!element.config.settings.varname) {
        console.warn('FormDynamicPanel: Missing varname setting');
        return false;
      }
      
      return true;
    },

    /**
     * Safely extracts settings from element with validation
     * @param {Object} element - The dynamic panel element
     * @returns {Object|null} Settings object or null if invalid
     */
    extractValidatedSettings(element) {
      if (!this.validateElementSettings(element)) {
        return null;
      }
      
      return {
        variableName: element.config.settings.varname,
        index: element.config.settings.indexName || '',
        emptyStateMessage: element.config.settings.emptyStateMessage
      };
    },

    /**
     * Loads the properties for the FormDynamicPanel
     * @param {Object} params - The parameters object
     */
    loadFormDynamicPanelProperties({ properties, element }) {
      const settings = this.extractValidatedSettings(element);
      if (!settings) {
        return;
      }

      // Add itemData to the properties of FormDynamicPanel
      properties[':itemData'] = this.buildItemDataExpression(settings.variableName, settings.index);
      
      // Add emptyStateMessage property with helpful default
      const emptyStateMessage = this.getEmptyStateMessage(settings.index, settings.emptyStateMessage);
      properties[':emptyStateMessage'] = this.byRef(emptyStateMessage);
      
      // Add validationData for Mustache processing
      properties[':validationData'] = 'getValidationData()';
      
      this.registerVariable(settings.variableName, element);
    },
    /**
     * Loads the items for the FormDynamicPanel
     * @param {Object} params - The parameters object
     */
    loadFormDynamicPanelItems({ element, node, definition }) {
      const settings = this.extractValidatedSettings(element);
      if (!settings) {
        return;
      }

      const nested = this.buildNestedConfig(element);

      // Build expressions based on index availability
      const { valueExpression, loopContextExpression } = this.buildExpressions(settings.variableName, settings.index);

      // Create and add the ScreenRenderer component
      const child = this.createScreenRenderer(nested, valueExpression, loopContextExpression, definition);
      node.appendChild(child);
    }
  },
  mounted() {
    // Convert the FormDynamicPanel to a div
    this.extensions.push({
      onloadproperties(params) {
        if (params.element.container && params.componentName === "FormDynamicPanel") {
          this.loadFormDynamicPanelProperties(params);
        }
      },
      onloaditems(params) {
        if (params.element.container && params.componentName === "FormDynamicPanel") {
          this.loadFormDynamicPanelItems(params);
        }
      }
    });
  }
};
