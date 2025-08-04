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
    loadFormDynamicPanelProperties({ properties, element }) {
      const variableName = element.config.settings.varname;
      const index = element.config.settings.indexName;

      // Add itemData to the properties of FormDynamicPanel
      properties[':itemData'] = `${variableName} && ${variableName}[${index}]`;
      this.registerVariable(element.config.settings.varname, element);
    },
    loadFormDynamicPanelItems({ element, node, definition }) {
      const nested = {
        config: [
          {
            items: element.items,
          }
        ],
        watchers: [], 
        isMobile: false
      };


      const variableName = element.config.settings.varname;
      const index = element.config.settings.indexName;

      // Add nested component inside dynamic panel
      const child = this.createComponent("ScreenRenderer", {
        ":definition": this.byRef(nested),
        ":value": `${variableName} && ${variableName}[${index}]`,
        ":loop-context": `'${variableName} && ${variableName}[${index}]'`,
        ":_parent": "getValidationData()",
        ":components": this.byRef(this.components),
        ":config-ref": this.byRef(this.configRef || definition.config),
        "@submit": "submitForm"
      });
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
