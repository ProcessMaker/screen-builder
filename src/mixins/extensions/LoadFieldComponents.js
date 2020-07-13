export default {
  methods: {
    loadFieldProperties({ properties, element, componentName }) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'vdata';
      if (componentName === 'FormImage') {
        this.registerVariable(element.config.variableName, element.config);
        delete properties.image;
        properties[':image'] = this.byRef(element.config.image);
      } else if (element.config.name) {
        this.registerVariable(element.config.name, element.config);
        properties['v-model'] = `${element.config.name}`;
      }
      // Add cypress testing tags
      if (element.config.name) {
        properties['data-cy'] = `screen-field-${element.config.name}`;
      }
      properties[':ancestor-screens'] = '$parent && $parent.ancestorScreens';
      properties.name = element.config.name !== undefined ? element.config.name : null;
      properties.disabled = element.config.interactive || element.config.disabled;
      properties[':form-config'] = '$parent && $parent.definition.config';
      // Events
      properties['@submit'] = 'submitForm';
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (!params.element.container) {
          this.loadFieldProperties(params);
        }
      },
    });
  },
};
