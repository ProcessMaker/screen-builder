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
      const index = element.config.settings.times;

      // Add itemData to the properties of FormDynamicPanel
      properties[':itemData'] = `${variableName}?.[${index}]`;
      this.registerVariable(element.config.settings.varname, element);
      /*this.loops.push({
        variable: element.config.settings.varname,
        element,
        properties
      });*/
    },
    loadFormDynamicPanelItems({ element, node, definition }) {
      //const safeDotName = this.safeDotName(element.config.settings.varname);
      const nested = {
        config: [
          {
            items: element.items,
          }
        ],
        watchers: [], //definition.watchers,
        isMobile: false //definition.isMobile
      };

      let loopContext = "";
      if (this.loopContext) {
        loopContext = `${this.loopContext}.`;
      }
      loopContext += element.config.settings.varname;

      const variableName = element.config.settings.varname;
      const index = element.config.settings.times;
      // Add nested component inside loop
      const child = this.createComponent("ScreenRenderer", {
        ":definition": this.byRef(nested),
        ":value": `${variableName}?.[${index}]`, //"currentItem",
        ":loop-context": `'${variableName}?.[${index}]'`,
        //":loop-context": `'${loopContext}'`,
        ":_parent": "getValidationData()",
        ":components": this.byRef(this.components),
        ":config-ref": this.byRef(this.configRef || definition.config),
        "@submit": "submitForm"
      });
      node.appendChild(child);
      // this.registerVariable(element.config.settings.varname, element);
      // Register nested component as Array
      /*this.registerNestedVariable(
        element.config.settings.varname,
        `${element.config.settings.varname}.index.`,
        nested
      );*/
    }
  },
  mounted() {
    // Convert the FormDynamicPanel to a div
    //this.alias.FormDynamicPanel = "div";
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
