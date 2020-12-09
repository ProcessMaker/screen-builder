export default {
  data() {
    return {
      popups: [],
    };
  },
  methods: {
    loadFormPopups({ definition }) {
      this.popups = [];
      definition.config.forEach(items => {
        items.items.forEach(item => {
          if (item.component === 'FormRecordList') {
            this.popups.push(parseInt(item.config.form));
          }
        });
      });
    },
    loadFieldProperties({ properties, element, componentName, definition , formIndex}) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'vdata';
      //verify if component is defined in popup
      if (!this.popups.includes(formIndex)) {
        if (componentName === 'FormImage') {
          this.registerVariable(element.config.variableName, element.config);
          delete properties.image;
          properties[':image'] = this.byRef(element.config.image);
        } else if (this.validVariableName(element.config.name)) {
          this.registerVariable(element.config.name, element.config);
          properties['v-model'] = `${element.config.name}`;
        }
      }
      // Do not replace mustache in RichText control, it is replaced by the control
      if (componentName === 'FormHtmlViewer') {
        delete properties.content;
        properties[':content'] = this.byValue(element.config.content);
      }
      // Add cypress testing tags
      if (element.config.name) {
        properties['data-cy'] = `screen-field-${element.config.name}`;
      }
      properties[':ancestor-screens'] = '$parent && $parent.ancestorScreens';
      properties.name = element.config.name !== undefined ? element.config.name : null;
      properties.disabled = element.config.interactive || element.config.disabled;
      properties[':form-config'] = this.byRef(this.configRef || definition.config);
      properties[':form-computed'] = JSON.stringify(definition.computed);
      // Events
      properties['@submit'] = 'submitForm';
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (!params.element.container) {
          this.loadFormPopups(params);
          this.loadFieldProperties(params);
        }
        params.properties[':config'] = this.byValue(params.element.config);
        params.properties[':transientData'] = 'vdata';
      },
    });
  },
};
