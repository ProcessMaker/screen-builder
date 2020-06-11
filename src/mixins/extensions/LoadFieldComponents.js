export default {
  methods: {
    loadFieldProperties({ properties, element }) {
      properties.class = this.elementCssClass(element);
      properties[':validation-data'] = 'vdata';
      this.registerVariable(element.config.name, element.config);
      properties['v-model'] = `${element.config.name}`;
      properties[':ancestor-screens'] = '$parent && $parent.ancestorScreens';
      properties.name = element.config.name !== undefined ? element.config.name : null;
      properties.disabled = element.config.interactive || element.config.disabled;
      properties[':form-config'] = '$parent && $parent.definition.config';
      // events
      //properties.input="dataChanged";
      //properties.submit="submit";
      //properties.pageNavigate = '$parent.pageNavigate';
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
