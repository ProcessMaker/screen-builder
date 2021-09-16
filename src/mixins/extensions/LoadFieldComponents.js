export default {
  data() {
    return {
      popups: [],
    };
  },
  methods: {
    searchForRecordList(items) {
      items.forEach(item => {
        if (item instanceof Array) {
          this.searchForRecordList(item);
        }
        if (item.items) {
          this.searchForRecordList(item.items);
        }
        if (item.component === 'FormRecordList') {
          this.popups.push(parseInt(item.config.form));
        }
      });
    },
    loadFormPopups({ definition }) {
      this.popups = [];
      definition.config.forEach(page => {
        if (page && page.items) {
          this.searchForRecordList(page.items);
        }
      });
    },
    loadFieldProperties({ properties, element, componentName, definition , formIndex}) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'getValidationData()';

      //verify if component is defined in popup
      if (!this.popups.includes(formIndex)) {
        if (componentName === 'FormImage') {
          this.registerVariable(element.config.variableName, element);
          delete properties.image;
          properties[':image'] = this.byRef(element.config.image);
        } else if (this.validVariableName(element.config.name)) {
          this.registerVariable(element.config.name, element);
          properties['v-model'] = `${element.config.name}`;
        }
      }
      // Do not replace mustache in RichText control, it is replaced by the control
      if (componentName === 'FormHtmlViewer' || componentName === 'FormHtmlEditorStatic') {
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
      properties[':form-watchers'] = JSON.stringify(definition.watchers);
      // Check if control is assigned to a calculated property
      const isCalcProp = definition.computed && !!definition.computed.find(computed => computed.property == element.config.name);
      properties[':readonly'] = isCalcProp || element.config.readonly;
      properties[':disabled'] = isCalcProp || element.config.disabled;
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
