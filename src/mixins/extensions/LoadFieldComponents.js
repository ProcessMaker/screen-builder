export default {
  methods: {
    loadFieldProperties({ properties, element, componentName }) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'vdata';
      if (element.config.name && componentName !== 'FormImage' ) {
        this.registerVariable(element.config.name, element.config);
        properties['v-model'] = `${element.config.name}`;
      } else if (componentName === 'FormImage') {
        this.registerVariable(element.config.variableName, element.config);
      }
      properties[':ancestor-screens'] = '$parent && $parent.ancestorScreens';
      properties.name = element.config.name !== undefined ? element.config.name : null;
      properties.disabled = element.config.interactive || element.config.disabled;
      properties[':form-config'] = '$parent && $parent.definition.config';
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
