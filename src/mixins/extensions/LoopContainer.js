export default {
  props: {
    configRef: null,
    loopContext: null
  },
  data() {
    return {
      loops: []
    };
  },
  methods: {
    loadFormLoopProperties({ properties, element }) {
      this.registerVariable(element.config.settings.varname, element);
      this.loops.push({
        variable: element.config.settings.varname,
        element,
        properties
      });
    },
    loadFormLoopItems({ element, node, definition }) {
      const safeDotName = this.safeDotName(element.config.settings.varname);
      const loop = this.createComponent("div", {
        "v-for": `(loopRow, index) in ${safeDotName}`
      });
      const nested = {
        config: [
          {
            items: element.items
          }
        ],
        watchers: definition.watchers
      };

      let loopContext = "";
      if (this.loopContext) {
        loopContext = `${this.loopContext}.`;
      }
      loopContext += element.config.settings.varname;

      // Add nested component inside loop
      const child = this.createComponent("ScreenRenderer", {
        ":definition": this.byRef(nested),
        ":value": "loopRow",
        ":loop-context": `'${loopContext}.' + index`,
        ":_parent": "getValidationData()",
        ":components": this.byRef(this.components),
        ":config-ref": this.byRef(this.configRef || definition.config),
        "@submit": "submitForm"
      });
      const addLoopRow = this.createComponent("AddLoopRow", {
        ":value": safeDotName,
        ":config": this.byRef(element.config),
        ":error": `${this.checkVariableExists(
          `$v.vdata.${element.config.name}`
        )} && validationMessage($v.vdata.${element.config.name})
        || ${this.checkVariableExists(`$v.schema.${element.config.name}`)}
        && validationMessage($v.schema.${element.config.name})`
      });
      loop.appendChild(child);
      node.appendChild(loop);
      node.appendChild(addLoopRow);
      // Register nested component as Array
      this.registerNestedVariable(
        element.config.settings.varname,
        `${element.config.settings.varname}.index.`,
        nested
      );
    }
  },
  mounted() {
    this.alias.FormLoop = "div";
    this.extensions.push({
      beforeload() {
        this.loops.splice(0);
      },
      onloadproperties(params) {
        if (params.element.container && params.componentName === "FormLoop") {
          this.loadFormLoopProperties(params);
        }
      },
      onloaditems(params) {
        if (params.element.container && params.componentName === "FormLoop") {
          this.loadFormLoopItems(params);
        }
      }
    });
  }
};
